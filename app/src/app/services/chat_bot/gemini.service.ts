import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Message } from '../../interfaces/activeFile-interface';

export const GENAI_API_KEY = new InjectionToken<string>('GENAI_API_KEY');

@Injectable({ providedIn: 'root' })
export class GeminiService {
  constructor(@Optional() @Inject(GENAI_API_KEY) private readonly apiKey?: string) {}

  async *streamChat(_history: Message[], newMessage: string) {
    // Fallback streaming that simply echoes the user input until a proper AI provider is configured.
    const safeText = newMessage || 'Hola, ¿en qué puedo ayudarte?';
    yield `He recibido tu mensaje: ${safeText}`;
  }
}
