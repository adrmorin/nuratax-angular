import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
    text: string;
    type: 'bot' | 'user';
    timestamp: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // Usar signals en lugar de BehaviorSubject para mejor integración con Angular 17+
    public messages = signal<ChatMessage[]>([]);

    addMessage(message: ChatMessage): void {
        this.messages.update(msgs => [...msgs, message]);
    }

    loadMessages(): void {
        const initialMessages: ChatMessage[] = [
            { text: 'Hello! How can I help you?', type: 'bot', timestamp: '19:58' },
            { text: 'What makes you different?', type: 'user', timestamp: '19:59' },
        ];
        this.messages.set(initialMessages);
    }

    clearMessages(): void {
        this.messages.set([]);
    }
}
