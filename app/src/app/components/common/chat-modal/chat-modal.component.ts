import { ChangeDetectorRef, Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { N8nChatService } from '../../../services/n8n-chat.service';
import { AuthService } from '../../../services/auth.service';
import { ChatLauncherService, ChatAction } from '../../../services/chat-launcher.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventStreamService } from '../../../services/event-stream.service';
import { SseEvent } from '../../../interfaces/sse-interface';

interface ChatMessage {
    sender: 'user' | 'bot' | 'system';
    text: string;
}

@Component({
    selector: 'app-chat-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat-modal.component.html',
    styleUrls: ['./chat-modal.component.scss']
})
export class ChatModalComponent implements OnInit, OnDestroy {
    isOpen = false;
    isLoading = false;
    userInput = '';
    messages: ChatMessage[] = [
        { sender: 'bot', text: "Welcome to Neuraltax chat. How can I help you today?" }
    ];
    sessionExists = false;

    private eventSource?: EventSource

    // Avatars
    botAvatarUrl: string = 'assets/img/bot/Gaia fonta 2l.png';    // Preferred for chat bubbles (Gaia face)
    botIconUrl: string = 'assets/img/bot/Gaia fonta 2l.png';      // Compact icon for header (prioritize face)
    userAvatarUrl: string | null = 'assets/img/bot/R (1).png'; // Default user avatar (guest/unset)

    private sub?: Subscription;
    private lastSendAt = 0;

    constructor( private n8n: N8nChatService, private auth: AuthService, private chatLauncher: ChatLauncherService, private eventStream: EventStreamService,
        private zone: NgZone, private cdr: ChangeDetectorRef, ) { }

    ngOnInit(): void {
        this.sub = this.chatLauncher.actions$.subscribe((action: ChatAction) => {
            if (action.type === 'open') {
                this.open();
            } else if (action.type === 'openAndSend') {
                this.open();
                this.userInput = action.message;
                this.send();
            }
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
        this.eventSource?.close();
    }

    open() {
        this.isOpen = true;
        this.sessionExists = this.n8n.hasPersistedSession();
        // For guests (no token), generate a fresh session key each time the chat opens
        const token = this.auth.getToken();
        if (!token) {
            const key = this.generateGuestKey();
            this.n8n.setGuestKey(key);
        } else {
            // Logged in users rely on their auth token; clear guest key
            this.n8n.setGuestKey(null);
        }
    }
    close() {
        this.eventSource?.close();
        this.eventSource = undefined;
        this.isOpen = false;
    }

    continueSession(): void {
        this.sessionExists = false;
    }

    startNewSession(): void {
        this.eventSource?.close();
        this.eventSource = undefined;
        //this.n8n.resetGuestKey();
        const newKey = this.generateGuestKey();
        this.n8n.setGuestKey(newKey);
        this.messages = [
            { sender: 'bot', text: "Welcome to Neuraltax chat. How can I help you today?" }
        ];
        this.isLoading = false;
        this.userInput = '';
        this.sessionExists = false;
        this.cdr.detectChanges();
    }
    toggle() { this.isOpen = !this.isOpen; }

    send(): void {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    console.log('[Chat] Sending message:', text);

    // Push user message
    this.messages.push({ sender: 'user', text });
    this.userInput = '';
    this.lastSendAt = performance.now();
    this.cdr.detectChanges();
    this.scrollToBottom();

    this.isLoading = true;

    this.n8n.sendMessage(text).subscribe({
        next: (message: string) => {

            console.log('[Chat] Received correlationId:', message);

            this.eventSource = this.eventStream.connect(message);
            const source = this.eventSource;

            console.log('[SSE] Connecting to stream for correlationId:', message);

            source.onmessage = (event) => {
                const receivedAt = performance.now();
                console.log('[SSE] Raw event received:', event.data, 'Δms from send:', Math.round(receivedAt - this.lastSendAt));

                const data: SseEvent = JSON.parse(event.data);
                console.log('[SSE] Parsed event:', data);

                if (data.type === 'CHAT_REPLY') {
                    this.zone.run(() => {
                        const renderedAt = performance.now();
                        console.log('[Chat] AI reply received:', data.message, 'Δms from send:', Math.round(renderedAt - this.lastSendAt));

                        this.messages.push({
                            sender: 'bot',
                            text: data.message || '(No response)'
                        });

                        this.isLoading = false;
                        this.cdr.detectChanges();
                        this.scrollToBottom();
                        this.cdr.detectChanges();

                        requestAnimationFrame(() => {
                            const paintedAt = performance.now();
                            console.log('[Chat] Bubble painted Δms from send:', Math.round(paintedAt - this.lastSendAt));
                        });
                    });

                    source.close();
                    console.log('[SSE] Stream closed for correlationId:', message);

                } else {
                    console.warn('[SSE] Unhandled SSE event type:', data);
                }
            };

            source.onerror = (err) => {
                this.zone.run(() => {
                    console.error('[SSE] Stream error:', err);

                    source.close();
                    this.messages.push({
                        sender: 'system',
                        text: 'There was an error contacting the assistant.'
                    });
                    this.isLoading = false;
                    this.cdr.detectChanges();
                });
            };
        },
        error: (err) => {
            console.error('[Chat] Error sending message to backend:', err);

            this.messages.push({
                sender: 'system',
                text: 'There was an error contacting the assistant.'
            });
            this.isLoading = false;
        }
    });}


    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.send();
        }
    }

    private scrollToBottom() {
        const list = document.getElementById('ntx-chat-messages');
        if (!list) return;
        requestAnimationFrame(() => {
            list.scrollTop = list.scrollHeight;
        });
    }

    private generateGuestKey(): string {
        // Prefer crypto.randomUUID when available
        const g: any = (globalThis as any);
        if (g?.crypto?.randomUUID) return g.crypto.randomUUID();
        // Fallback: pseudo-UUID
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${Date.now()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}`;
    }
}
