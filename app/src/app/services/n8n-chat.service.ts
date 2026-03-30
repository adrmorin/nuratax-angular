import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class N8nChatService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private readonly apiUrl = environment.apiUrl;
    private guestKey: string | null = null;
    private currentEventSource: EventSource | null = null;

    // Store active streams to allow cancellation
    private streamSubject = new Subject<string>();

    // Allow components to set a transient guest session key when user is not logged in
    setGuestKey(key: string | null) {
        this.guestKey = key;
    }

    private generateId(): string {
        const g = globalThis as Record<string, unknown>;
        if (g?.['crypto'] && typeof (g['crypto'] as Record<string, unknown>)['randomUUID'] === 'function') {
            return ((g['crypto'] as Record<string, unknown>)['randomUUID'] as () => string)();
        }
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return `${Date.now()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}`;
    }

    // Always return a non-empty session key: prefer user token, then guestKey, else generate one
    private ensureSessionKey(): string {
        const token = this.auth.getToken();
        if (token && token.trim() !== '') return token;
        if (this.guestKey && this.guestKey.trim() !== '') return this.guestKey;
        this.guestKey = this.generateId();
        return this.guestKey;
    }

    sendMessage(message: string): Observable<string> {
        const sessionKey = this.ensureSessionKey();

        // 1. POST message to backend to start the process
        return this.http.post<{ correlationId: string }>(`${this.apiUrl}/api/n8n/chat/message`, {
            message,
            sessionKey
        }).pipe(
            switchMap(response => {
                if (!response.correlationId) {
                    throw new Error('No correlation ID received from backend');
                }
                // 2. Connect to SSE stream
                return this.streamResponse(response.correlationId);
            })
        );
    }

    private streamResponse(correlationId: string): Observable<string> {
        return new Observable<string>(observer => {
            const url = `${this.apiUrl}/api/chat/stream/${correlationId}`;

            // Close any existing connection
            if (this.currentEventSource) {
                this.currentEventSource.close();
            }

            const eventSource = new EventSource(url);
            this.currentEventSource = eventSource;

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Check for completion signal
                    if (data.type === 'END') {
                        eventSource.close();
                        observer.complete();
                        return;
                    }

                    // Emit content chunks for chat replies
                    if (data.type === 'CHAT_REPLY' && data.message) {
                        observer.next(data.message);
                    }
                } catch {
                    // If parsing fails, emit raw data if it's not empty
                    if (event.data) {
                        observer.next(event.data);
                    }
                }
            };

            eventSource.onerror = (error) => {
                // EventSource errors are often generic, so we close and error out
                eventSource.close();
                observer.error(error);
            };

            // Cleanup when observable is unsubscribed
            return () => {
                eventSource.close();
                if (this.currentEventSource === eventSource) {
                    this.currentEventSource = null;
                }
            };
        });
    }

    public hasPersistedSession(): boolean {
      return true;
    }
}
