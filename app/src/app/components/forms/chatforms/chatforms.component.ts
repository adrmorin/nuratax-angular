import { Component, signal, ElementRef, ViewChild, AfterViewChecked, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormAutomationService } from '../../../services/form-automation.service';

interface Message {
    text: string;
    isUser: boolean;
    timestamp: Date;
}

@Component({
    selector: 'app-chatforms',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatforms.component.html',
    styleUrls: ['./chatforms.component.css']
})
export class ChatFormsComponent implements OnInit, AfterViewChecked {
    private automationService = inject(FormAutomationService);

    isOpen = signal(false);
    userInput = signal('');
    verticalOffset = signal(100);

    messages = signal<Message[]>([
        {
            text: 'Vamos a trabajar en vuestro tax 2026 en la proforma 1040 Individual. Vamos a por ello!',
            isUser: false,
            timestamp: new Date()
        }
    ]);

    @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

    private synthesis!: SpeechSynthesis;
    private selectedVoice: SpeechSynthesisVoice | null = null;

    constructor() {
        // Inicialización segura: evita acceder a 'window' fuera de un contexto de browser
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synthesis = window.speechSynthesis;
            this.initVoiceSelection();
        }
    }

    ngOnInit() {
        // Start with the first automated question after a short delay
        setTimeout(() => {
            this.askNextQuestion();
        }, 1500);
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch {
            // Container might not be ready yet
        }
    }

    private initVoiceSelection(): void {
        const loadVoices = () => {
            const voices = this.synthesis.getVoices();
            const targetLocale = 'es-MX';
            const preferredVoices = voices.filter(v => {
                const name = v.name.toLowerCase();
                const isFemale = name.includes('female') || name.includes('zira') || name.includes('helena') || name.includes('natural');
                return v.lang.startsWith(targetLocale) && isFemale;
            });
            this.selectedVoice = preferredVoices.find(v => v.name.toLowerCase().includes('natural')) || preferredVoices[0];
        };

        if (this.synthesis.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synthesis.onvoiceschanged = loadVoices;
        }
    }

    private speak(text: string): void {
        if (!this.synthesis) return;
        this.synthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>?/gm, ''));
        utterance.lang = 'es-MX';
        if (this.selectedVoice) utterance.voice = this.selectedVoice;
        utterance.rate = 1.05;
        utterance.pitch = 0.9;
        this.synthesis.speak(utterance);
    }

    toggleChat() {
        this.isOpen.update(v => !v);
    }

    sendMessage() {
        const text = this.userInput().trim();
        if (!text) return;

        // 1. Add user message
        this.addMessage(text, true);
        this.userInput.set('');

        // 2. Update the field in the form via service
        this.automationService.updateField(text);

        // 3. Move to next step and ask next question
        setTimeout(() => {
            this.automationService.nextStep();
            if (this.automationService.isCompleted()) {
                this.addMessage('Hemos completado todas las secciones principales. ¡Buen trabajo!', false);
            } else {
                this.askNextQuestion();
            }
        }, 1000);
    }

    private askNextQuestion() {
        const step = this.automationService.currentStep();
        if (step) {
            this.addMessage(step.question, false);
            this.speak(step.question);

            // Move assistant to the section anchor
            if (step.anchorId) {
                this.scrollToSection(step.anchorId);
            }
        }
    }

    private addMessage(text: string, isUser: boolean) {
        this.messages.update(msgs => [...msgs, {
            text,
            isUser,
            timestamp: new Date()
        }]);
    }

    private scrollToSection(anchorId: string) {
        const element = document.getElementById(anchorId);
        if (element) {
            // Get the relative top position of the element within the form container
            const container = document.querySelector('.irs-form-container');
            if (container) {
                const rect = element.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const relativeTop = rect.top - containerRect.top;

                // Update vertical offset of the assistant
                this.verticalOffset.set(relativeTop + 50);
            }
        }
    }
}
