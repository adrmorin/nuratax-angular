import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PromptService {
    // Usar signal para reactividad
    private promptData = signal<unknown>(null);

    setPrompt(data: unknown): void {
        this.promptData.set(data);
        console.log('💾 Prompt data set:', data);
    }

    getPrompt(): unknown {
        const data = this.promptData();
        console.log('📖 Prompt data get:', data);
        return data;
    }

    clearPrompt(): void {
        this.promptData.set(null);
        console.log('🗑️ Prompt data cleared');
    }
}
