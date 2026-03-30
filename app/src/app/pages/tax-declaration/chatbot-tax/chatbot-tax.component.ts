import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileInfo, FileMeta, Message } from '../../../interfaces/activeFile-interface';
import { GeminiService } from '../../../services/chat_bot/gemini.service';
import { VoiceService } from '../../../services/chat_bot/voice.service';
import { ChatBootstrapService } from '../../../services/chat-bootstrap.service';
import { DocumentAnalysisService } from '../../../services/document-analysis.service';
import { TaxState } from '../../../interfaces/taxState-interface';
import { BotTurnPayload } from '../../../interfaces/botTurnPayload-interface';
import { DocumentSyncService } from '../../../services/document-sync.service';
import { Subscription } from 'rxjs';

const INITIAL_GREETING = 'Greetings. I am Neuraltax Gaia. How can I assist you today with your tax intelligence and technical strategy?';
const USER_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHmvxVWdyQ1tszjhBvJMDj49czcyeu_IHs42OXsCjXgs7_pBTDcJEL-6IWHjVSeTzdvZKhYt6YaAsLmtrdqfbs7zlhtciQJZFsbKtUMX3NgHrqdK2l2nsxhEkeqQwIRvCMG6q-CdXAZRYYd3vhTHSD5TOVDnlGenX-2xe6vNmNPDkubv6-VHGDyP3i1fl0rxMwq4U5OM6qlvcfgl3hyxQ2IJmlt7DhfIspEF0mwvA-JYoxLKOaaTkcWkc_fy-pYAi8vVEdZcoA_c';
const ASSISTANT_AVATAR = 'https://i.postimg.cc/VLW85GLY/Gemini-Generated-Image-vzb6fzvzb6fzvzb6.png';
const NETWORK_BG = 'https://i.postimg.cc/WpxnrXKR/grafismo.png';
const LOGO_URL = 'https://i.postimg.cc/Dwn1dDcb/Neuraltax.png';
const SESSION_STORAGE_KEY = 'chatbot_tax_session_id';

const EMPTY_TAX_STATE: TaxState = {
    meta: {
        source_document: 'Preguntas neuraltax.pdf',
        source_file_id: 'file_000_preguntas',
        created_at: '2026-01-01T10:00:00Z',
        updated_at: null,
        answers_log: [],
    },
    tax_info: {
        filing_status: null,
        gross_income: null,
        withholding: null,
        claimed_elsewhere: null,
        residency_status: null,
        age_of_taxpayer: null,
        dependents_count: null,
    },
    dependents: [],
    expenses: {
        has_expenses: null,
        medical_expenses: null,
        charity: null,
        saving_accounts: null,
        disasters: null,
        retirement_plan_contributions: null,
        mortgage_interest_1098: null,
        details: [],
    },
    credits: {
        has_credits: null,
        child_tax_credit: { eligible: null, details: null },
        earned_income_tax_credit: { eligible: null, details: null },
        savers_credit: { eligible: null, details: null },
        child_dependent_care_credit: { eligible: null, details: null },
        american_opportunity_credit: { eligible: null, details: null },
    },
    adjustment: {
        requires_adjustment: null,
        adjustment_description: null,
        reported_cost_text: null,
        reported_cost_numeric: null,
        reported_cost_reported_to_irs: null,
        correct_cost_text: null,
        correct_cost_numeric: null,
        column_f_code: null,
        column_g_value: null,
    },
    other: {
        is_resident: null,
        blindness: null,
        additional_notes: null,
    },
    final_checks: {
        required_fields_complete: false,
        complete_timestamp: null,
    },
};

@Component({
    selector: 'app-chatbot-tax',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot-tax.component.html',
    styleUrls: ['./chatbot-tax.component.scss'],
    styles: [
        `@keyframes wave { 0%, 100% { height: 4px; } 50% { height: 16px; } }
     .animate-wave-sm { animation: wave 1s ease-in-out infinite; }
     .animate-wave-md { animation: wave 1s ease-in-out infinite 0.2s; }
     .animate-wave-lg { animation: wave 1s ease-in-out infinite 0.4s; }`,
    ],
})

export class ChatbotTaxComponent implements OnInit, AfterViewInit, OnDestroy {
    messages: Message[] = [];
    activeFiles: FileInfo[] = [];
    gaiaBannerText = INITIAL_GREETING;
    isGaiaSpeaking = false;
    isGaiaPaused = false;
    inputText = '';
    isLoading = false;
    isRecording = false;
    isVoiceEnabled = true;
    isChatReady = false;
    showUploadOverlay = true;
    documentListExpanded = true;
    editingFileId: string | null = null;
    editName = '';
    showConfirmModal = false;
    private hasStartedConversation = false;
    private sentDocIds = new Set<string>();
    private sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    isTyping = false;
    taxState: TaxState = JSON.parse(JSON.stringify(EMPTY_TAX_STATE));
    showUploadOptions = false;
    showMobileQr = false;
    mobileUploadUrl = '/mobile-upload';
    qrImageUrl = '';
    copyMessage = '';
    private copyMessageTimer?: ReturnType<typeof setTimeout>;
    private docSyncSub?: Subscription;

    @Output() completed = new EventEmitter<boolean>();
    @Output() closed = new EventEmitter<void>();

    @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;

    constructor(
        private readonly gemini: GeminiService,
        private readonly voice: VoiceService,
        private readonly cdr: ChangeDetectorRef,
        private readonly bootstrap: ChatBootstrapService,
        private readonly docAnalysis: DocumentAnalysisService,
        private readonly docSync: DocumentSyncService,
    ) { }

    ngOnInit() {
        if (typeof window !== 'undefined') {
            this.mobileUploadUrl = `${window.location.origin}/mobile-upload`;
            this.qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(this.mobileUploadUrl)}`;
        }

        const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        if (storedSession) this.sessionId = storedSession;
        this.messages = [];
        // this.startConversation(); // Deliberately delayed until docs are confirmed and overlay closes

        this.docSyncSub = this.docSync.documents$.subscribe((metas) => {
            if (!metas) return;
            console.log('[DocumentSync] metadata updated', metas);
        });

         console.log('[DocumentSync] file updated', this.activeFiles);
        // Pull any storage updates that occurred before subscription
        this.docSync.refreshFromStorage();
    }

    ngAfterViewInit() {
        this.scrollToBottom();
    }

    handlePlay() {
        this.voice.resume();
        this.isGaiaPaused = false;
    }

    handlePause() {
        this.voice.pause();
        this.isGaiaPaused = true;
    }

    handleStop() {
        this.voice.stop();
        this.isGaiaSpeaking = false;
        this.isGaiaPaused = false;
    }

    toggleRecording() {
        this.isRecording = !this.isRecording;
    }

    toggleVoice() {
        this.isVoiceEnabled = !this.isVoiceEnabled;
    }

    async triggerAudioUnlock() {
        await this.voice.getAudioContext();
    }

    handleClose() {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        this.closed.emit();
    }

    async handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (!files || files.length === 0) return;

        const newFiles: FileInfo[] = Array.from(files).map((f) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: f.name,
            size: f.size,
            type: f.type,
            file: f,
        }));

        const updatedFiles = [...this.activeFiles, ...newFiles];
        this.activeFiles = updatedFiles;

        const metas: FileMeta[] = updatedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size ?? 0,
            type: f.type ?? '',
        }));

        this.docSync.setDocuments(
            this.activeFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size ?? 0,
            type: f.type ?? '',
            }))
        );
        this.documentListExpanded = true;
        this.editingFileId = null;
        this.editName = '';
        input.value = '';
        this.scrollToBottom();
    }

    toggleUploadOptions() {
        this.showUploadOptions = !this.showUploadOptions;
        if (!this.showUploadOptions) this.showMobileQr = false;
    }

    openDesktopPicker(input: HTMLInputElement) {
        if (!input) return;
        input.click();
        this.showUploadOptions = false;
        this.showMobileQr = false;
    }

    openMobileQr() {
        this.ensureQrReady();
        this.showMobileQr = true;
        this.showUploadOptions = false;
    }

    hideMobileQr() {
        this.showMobileQr = false;
    }

    async copyMobileLink() {
        if (!this.mobileUploadUrl) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(this.mobileUploadUrl);
                this.copyMessage = 'Link copied to clipboard';
            } else {
                this.copyMessage = 'Copy manually: ' + this.mobileUploadUrl;
            }
        } catch (err) {
            console.error('No se pudo copiar el enlace', err);
            this.copyMessage = 'Could not copy, please try manually.';
        }

        this.scheduleCopyMessageReset();
    }

    proceedAfterDocs() {
        if (this.activeFiles.length > 0) {
            this.showConfirmModal = true;
            return;
        }
        // Require at least one document before starting the chat
        return; // Added return to prevent proceeding without documents
    }

    confirmDocumentsToSend() {
        console.log('[DocumentSync] file updated', this.activeFiles);
        this.showConfirmModal = false;
        if (this.activeFiles.length === 0) return;
        const filesSnapshot = this.activeFiles
        .map(f => f.file)
        .filter((file): file is File => file instanceof File);
        console.log('[DocumentSync] filesSnapshot updated', filesSnapshot);
        if (filesSnapshot.length === 0) {
            console.error('No valid File objects to send');
            return;
        }
        const filesForMessage: FileInfo[] = [...this.activeFiles];
        this.docAnalysis.analyzeDocuments(filesSnapshot, this.sessionId).subscribe({
            next: (res) => {
                const botText = res?.message || 'He recibido y revisaré tus documentos. Podemos continuar.';

                filesForMessage.forEach(f => this.sentDocIds.add(f.id));

                // 🔹 LIMPIEZA DESPUÉS
                this.activeFiles = [];
                this.docSync.clear();
                this.messages = [
                    ...this.messages,
                    {
                    id: `analysis-${Date.now()}`,
                    role: 'assistant',
                    text: botText,
                    timestamp: Date.now(),
                    },
                    {
                    id: `files-received-${Date.now()}`,
                    role: 'assistant',
                    text: 'He recibido la lista de documentos y comenzaré a procesarlos.',
                    type: 'files_received',
                    files: filesForMessage,
                    timestamp: Date.now(),
                    },
                ];
                this.gaiaBannerText = botText;
                this.finalizeOverlayExit();
                if (!this.hasStartedConversation) {
                    this.startConversation();
                }
            },
            error: (err) => {
                console.error('Error analyzing documents', err);
                const botText = 'No pude procesar los documentos. Revisa y vuelve a intentar.';
                this.messages = [
                    ...this.messages,
                    { id: `analysis-error-${Date.now()}`, role: 'assistant', text: botText, timestamp: Date.now() },
                ];
                this.scrollToBottom();
            },
        });
    }

    cancelDocumentsConfirm() {
        this.showConfirmModal = false;
    }

    private finalizeOverlayExit() {
        this.showUploadOverlay = false;
        this.isChatReady = true;
        this.scrollToBottom();
    }

    toggleDocumentList() {
        this.documentListExpanded = !this.documentListExpanded;
    }

    startEditDocument(file: FileInfo) {
        this.editingFileId = file.id;
        this.editName = file.name;
    }

    cancelEditDocument() {
        this.editingFileId = null;
        this.editName = '';
    }

    saveDocumentEdit(file: FileInfo) {
        const trimmedName = (this.editName || '').trim();
        if (!trimmedName) {
            this.cancelEditDocument();
            return;
        }

        if (!(file.file instanceof File)) {
            // No se puede renombrar si no hay File real
            this.cancelEditDocument();
            return;
        }

        const renamedFile = this.buildRenamedFile(file.file, trimmedName);
        const updatedFiles: FileInfo[] = this.activeFiles.map((f) =>
            f.id === file.id
                ? {
                    ...f,
                    name: renamedFile.name,
                    file: renamedFile,
                    type: renamedFile.type || f.type,
                    size: renamedFile.size,
                }
                : f
        );

        this.activeFiles = updatedFiles;
        const metas: FileMeta[] = updatedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size ?? 0,
            type: f.type ?? '',
        }));
        this.docSync.setDocuments(metas);
        this.cancelEditDocument();
    }

    private ensureQrReady() {
        if (this.qrImageUrl) return;
        const target = typeof window !== 'undefined' ? `${window.location.origin}/mobile-upload` : this.mobileUploadUrl;
        this.mobileUploadUrl = target;
        this.qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(target)}`;
    }

    private scheduleCopyMessageReset() {
        if (this.copyMessageTimer) {
            clearTimeout(this.copyMessageTimer);
        }
        this.copyMessageTimer = setTimeout(() => {
            this.copyMessage = '';
        }, 2200);
    }

    private buildRenamedFile(original: File, desiredName: string): File {
        const normalized = desiredName.trim();
        if (!normalized) return original;
        const hasExtension = /\.[^./\s]+$/.test(normalized);
        const extension = hasExtension ? '' : this.extractExtension(original.name);
        const finalName = `${normalized}${extension}`;
        if (finalName === original.name) return original;
        return new File([original], finalName, {
            type: original.type,
            lastModified: original.lastModified,
        });
    }

    private extractExtension(name: string): string {
        const match = name.match(/(\.[^./\s]+)$/);
        return match ? match[1] : '';
    }

    private startConversation() {
        if (this.hasStartedConversation) return;
        this.hasStartedConversation = true;

        const initialTurn = this.buildTurnPayload('Start the question system');

        this.bootstrap.initializeSession(initialTurn).subscribe({
            next: (res) => {
                console.log('Bot bootstrap response', res);

                const botText =
                    res?.chat_message ||
                    'Your session has been synchronized with the tax assistant and your initial context has been loaded.';

                if (res?.fields) this.mergeTaxState(res.fields);

                if (res?.session_id) {
                    this.sessionId = res.session_id;
                    localStorage.setItem(SESSION_STORAGE_KEY, this.sessionId);
                }

                this.gaiaBannerText = botText;

                const alreadyHasSame = this.messages.some(
                    (m) => m.role === 'assistant' && m.text?.trim() === botText?.trim(),
                );

                if (!alreadyHasSame) {
                    this.messages = [
                        ...this.messages,
                        {
                            id: `bootstrap-${Date.now()}`,
                            role: 'assistant',
                            text: botText,
                            timestamp: Date.now(),
                        },
                    ];
                }

                this.scrollToBottom();
            },

            error: (err) => {
                console.error('Bot bootstrap error', err);
                this.messages = [
                    ...this.messages,
                    {
                        id: `bootstrap-error-${Date.now()}`,
                        role: 'assistant',
                        text:
                            'I was unable to connect to the bot due to a network or CORS issue. Please use a proxy or enable CORS on the endpoint.',
                        timestamp: Date.now(),
                    },
                ];
                this.scrollToBottom();
            },
        });
    }

    async handleDeleteFile(fileId: string) {
        const updatedFiles: FileInfo[] =
            this.activeFiles.filter((f) => f.id !== fileId);

        // 🔹 UI / memoria
        this.activeFiles = updatedFiles;

        // 🔹 CONVERSIÓN FileInfo → FileMeta (storage)
        const metas: FileMeta[] = updatedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size ?? 0,
            type: f.type ?? '',
        }));

        this.docSync.setDocuments(metas);

        this.sentDocIds.delete(fileId);

        if (this.editingFileId === fileId) {
            this.cancelEditDocument();
        }
    }


    async handleSendMessage() {
        if (this.showUploadOverlay || !this.isChatReady) return;
        await this.triggerAudioUnlock();
        const textToSend = this.inputText.trim();
        if (!textToSend || this.isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend,
            timestamp: Date.now(),
        };

        this.messages = [...this.messages, userMessage];
        this.inputText = '';
        this.scrollToBottom();
        await this.runBotChat(textToSend);
    }

    async requestGaiaAcknowledgment(prompt: string) {
        if (this.isChatReady) await this.runBotChat(prompt);
    }

    async onEnterPress(event: KeyboardEvent) {
        if (!event.shiftKey) {
            event.preventDefault();
            await this.handleSendMessage();
        }
    }

    trackByMessageId(_: number, msg: Message) {
        return msg.id;
    }

    trackByFileId(_: number, file: FileInfo) {
        return file.id;
    }

    private scrollToBottom() {
        setTimeout(() => {
            const el = this.scrollContainer?.nativeElement;
            if (el) el.scrollTop = el.scrollHeight;
        });
    }

    private buildTurnPayload(userText: string, historyOverride?: Message[]): BotTurnPayload {
        return {
            userText,
            history: historyOverride ?? this.messages,
            taxState: this.taxState,
            emptyFields: this.getEmptyFields(this.taxState),
            sessionId: this.sessionId,
        };
    }

    private async runBotChat(prompt: string) {
        this.isLoading = true;
        this.isTyping = true;
        this.gaiaBannerText = '';
        const started = performance.now();

        const assistantId = (Date.now() + 1).toString();
        this.cdr.detectChanges();

        const historySnapshot = this.messages;
        const turnPayload = this.buildTurnPayload(prompt, historySnapshot);

        this.bootstrap.sendUserMessage(turnPayload).subscribe({
            next: (res) => {
                console.log('Bot chat latency ms', Math.round(performance.now() - started));
                const assistantText = res?.chat_message || 'I wasn’t able to get a response just now. Please try again in a moment.';
                if (res?.fields) this.mergeTaxState(res.fields);
                if (res?.session_id) this.sessionId = res.session_id;
                if (res?.session_id) localStorage.setItem(SESSION_STORAGE_KEY, this.sessionId);
                this.gaiaBannerText = assistantText;
                this.messages = [
                    ...this.messages,
                    { id: assistantId, role: 'assistant', text: assistantText, timestamp: Date.now() },
                ];
                this.isTyping = false;
                this.cdr.detectChanges();
                this.scrollToBottom();
                if (this.isVoiceEnabled) {
                    this.voice.speak(
                        assistantText,
                        () => {
                            this.isGaiaSpeaking = true;
                            this.isGaiaPaused = false;
                            this.cdr.detectChanges();
                        },
                        () => {
                            this.isGaiaSpeaking = false;
                            this.cdr.detectChanges();
                        },
                    );
                }
            },
            error: (err) => {
                console.error('Bot chat error', err);
                const fallback = 'I’m having trouble connecting right now. Please check your connection and try again.';
                this.gaiaBannerText = fallback;
                this.messages = [
                    ...this.messages,
                    { id: assistantId, role: 'assistant', text: fallback, timestamp: Date.now() },
                ];
                this.isTyping = false;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            complete: () => {
                this.completed.emit(true);
                this.isLoading = false;
                this.isTyping = false;
                this.scrollToBottom();
                this.cdr.detectChanges();
            },
        });
    }

    private mergeTaxState(patch: Partial<TaxState>) {
        this.taxState = this.deepMerge(this.taxState, patch);
    }

    private deepMerge(target: any, source: any): any {
        if (source === null || source === undefined) return target;
        if (typeof source !== 'object' || Array.isArray(source)) return source;
        const output = { ...target };
        Object.keys(source).forEach((key) => {
            const srcVal = (source as any)[key];
            if (Array.isArray(srcVal)) {
                output[key] = srcVal;
            } else if (srcVal && typeof srcVal === 'object') {
                output[key] = this.deepMerge(output[key] ?? {}, srcVal);
            } else {
                output[key] = srcVal;
            }
        });
        return output;
    }

    private getEmptyFields(obj: any, prefix = ''): string[] {
        const pathFor = (key: string) => (prefix ? `${prefix}.${key}` : key);
        if (obj === null || obj === undefined || obj === '') return prefix ? [prefix] : [];
        if (Array.isArray(obj)) {
            if (obj.length === 0) return prefix ? [prefix] : [];
            const results: string[] = [];
            obj.forEach((v, idx) => results.push(...this.getEmptyFields(v, `${prefix}[${idx}]`)));
            return results;
        }
        if (typeof obj === 'object') {
            const results: string[] = [];
            Object.entries(obj).forEach(([k, v]) => results.push(...this.getEmptyFields(v, pathFor(k))));
            return results;
        }
        return [];
    }

    ngOnDestroy() {
        if (this.copyMessageTimer) {
            clearTimeout(this.copyMessageTimer);
        }
        this.docSyncSub?.unsubscribe();
    }

    protected readonly USER_AVATAR = USER_AVATAR;
    protected readonly ASSISTANT_AVATAR = ASSISTANT_AVATAR;
    protected readonly NETWORK_BG = NETWORK_BG;
    protected readonly LOGO_URL = LOGO_URL;
}
