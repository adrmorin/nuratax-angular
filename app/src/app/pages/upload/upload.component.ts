import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { UserProfileMenuComponent } from '../../components/common/user-profile-menu/user-profile-menu.component';

interface TaxDocument {
    id: string;
    name: string;
    irsModel: string;
    type: 'pdf' | 'img' | 'doc';
    uploadDate: Date;
    size: string;
    year: number;
    status: 'verified' | 'pending' | 'rejected';
}

interface PendingFile {
    file: File;
    previewUrl: string | null;
    progress: number;
}

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, TranslateModule, UserProfileMenuComponent],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.css'
})
export class UploadComponent {
    public auth = inject(AuthService);
    public modalService = inject(ModalService);
    private location = inject(Location);

    // Profile Menu State
    isProfileMenuOpen = false;
    private menuTimeout: ReturnType<typeof setTimeout> | null = null;

    toggleProfileMenu() {
        if (this.menuTimeout) clearTimeout(this.menuTimeout);
        this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }

    cancelMenuClose() {
        if (this.menuTimeout) clearTimeout(this.menuTimeout);
    }

    closeProfileMenu() {
        if (this.menuTimeout) clearTimeout(this.menuTimeout);
        this.menuTimeout = setTimeout(() => {
            this.isProfileMenuOpen = false;
        }, 500);
    }

    get userName(): string {
        const user = this.auth.currentUser();
        if (!user) return '';
        if (user.firstName) {
            return `${user.firstName} ${user.lastName || ''}`.trim();
        }
        if (user.email) return user.email;
        return user.username || '';
    }

    get user() {
        return this.auth.currentUser();
    }

    get hasAuthenticatedUser(): boolean {
        return !!this.user;
    }

    readonly userAvatar: string | null = null;

    get userInitials(): string {
        if (!this.userName) return '';
        return this.userName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    openValidation() {
        this.isProfileMenuOpen = false;
        this.modalService.openValidate();
    }

    // Client/Portal Config
    clientType: 'free' | 'premium' | 'vip' | 'agent' = 'free'; // default to free

    private clientConfigs: Record<string, { brandSubtitle: string; accentColor: string }> = {
        free: { brandSubtitle: 'COMMON.FREE', accentColor: '#9ca3af' },
        premium: { brandSubtitle: 'COMMON.PREMIUM', accentColor: '#688071' },
        vip: { brandSubtitle: 'COMMON.VIP', accentColor: '#fbbf24' },
        agent: { brandSubtitle: 'COMMON.AGENT', accentColor: '#688071' }
    };

    get config() {
        return this.clientConfigs[this.clientType];
    }

    // Mock data representing IRS tax documents (Years 2024-2025)
    documents = signal<TaxDocument[]>([
        { id: '1', name: 'UPLOAD.DOCS.W2_MAIN', irsModel: 'W-2', type: 'pdf', uploadDate: new Date('2025-02-15T10:30:00'), size: '1.2 MB', year: 2025, status: 'verified' },
        { id: '2', name: 'UPLOAD.DOCS.FREELANCE', irsModel: '1099-NEC', type: 'pdf', uploadDate: new Date('2025-01-16T14:20:00'), size: '2.5 MB', year: 2025, status: 'verified' },
        { id: '3', name: 'UPLOAD.DOCS.BANK_INTEREST', irsModel: '1099-INT', type: 'img', uploadDate: new Date('2024-11-18T09:15:00'), size: '800 KB', year: 2024, status: 'pending' },
        { id: '4', name: 'UPLOAD.DOCS.HEALTH_REPORT', irsModel: '1095-A', type: 'pdf', uploadDate: new Date('2024-05-20T11:45:00'), size: '1.5 MB', year: 2024, status: 'pending' }
    ]);

    // Upload State
    isDragging = signal(false);
    pendingFiles = signal<PendingFile[]>([]);
    isUploadAreaVisible = signal(false);

    // Selected year for filtering (null means 'all years')
    selectedYear = signal<number | null>(null);

    // Computed properties
    years = computed(() => {
        const allYears = this.documents().map(doc => doc.year);
        return Array.from(new Set(allYears)).sort((a, b) => b - a);
    });

    filteredDocuments = computed(() => {
        const docs = this.documents();
        const yearFilter = this.selectedYear();

        if (yearFilter) {
            return docs.filter(doc => doc.year === yearFilter);
        }
        return docs;
    });

    groupedDocuments = computed(() => {
        const docs = this.filteredDocuments();
        const grouped = new Map<number, TaxDocument[]>();

        docs.forEach(doc => {
            const yearDocs = grouped.get(doc.year) || [];
            yearDocs.push(doc);
            grouped.set(doc.year, yearDocs);
        });

        // Convert to array of objects, sorted by year descending
        return Array.from(grouped.entries())
            .map(([year, documents]) => ({
                year,
                documents: documents.sort((a, b) => b.uploadDate.getTime() - a.uploadDate.getTime())
            }))
            .sort((a, b) => b.year - a.year);
    });

    // Actions
    onYearSelect(year: number | null): void {
        if (this.selectedYear() === year) {
            this.selectedYear.set(null); // Toggle off if clicked again
        } else {
            this.selectedYear.set(year);
        }
    }

    toggleUploadArea(): void {
        this.isUploadAreaVisible.update(v => !v);
    }

    goBack(): void {
        this.location.back();
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (files) {
            this.handleFiles(files);
        }
    }

    onFileDropped(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(false);
        const files = event.dataTransfer?.files;
        if (files) {
            this.handleFiles(files);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(false);
    }

    handleFiles(files: FileList): void {
        const newFiles: PendingFile[] = [];

        Array.from(files).forEach(file => {
            // Check if file is image or pdf
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';

            if (isImage || isPdf) {
                const pendingFile: PendingFile = {
                    file,
                    previewUrl: null,
                    progress: 0
                };

                if (isImage) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        pendingFile.previewUrl = e.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                }

                newFiles.push(pendingFile);
            }
        });

        this.pendingFiles.update(current => [...current, ...newFiles]);
    }

    removePendingFile(index: number): void {
        this.pendingFiles.update(files => files.filter((_, i) => i !== index));
    }

    uploadFiles(): void {
        if (this.pendingFiles().length === 0) return;

        // Simulate upload
        this.pendingFiles().forEach((pf, index) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                if (progress > 100) {
                    clearInterval(interval);
                    if (index === this.pendingFiles().length - 1) {
                        // Add to documents list when last one finishes
                        this.completeUpload();
                    }
                }
            }, 100);
        });
    }

    private completeUpload(): void {
        const now = new Date();
        const newDocs: TaxDocument[] = this.pendingFiles().map(pf => ({
            id: Math.random().toString(36).substr(2, 9),
            name: pf.file.name,
            irsModel: 'Pendiente',
            type: pf.file.type.startsWith('image/') ? 'img' : 'pdf',
            uploadDate: now,
            size: (pf.file.size / 1024 / 1024).toFixed(1) + ' MB',
            year: now.getFullYear(),
            status: 'pending'
        }));

        this.documents.update(current => [...newDocs, ...current]);
        this.pendingFiles.set([]);
        this.isUploadAreaVisible.set(false);
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
