import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap, timeout } from 'rxjs/operators';
import { BotTurnPayload } from '../interfaces/botTurnPayload-interface';
import { BotChatResponse } from '../interfaces/botChatResponse-interface';
import { environment } from '../../environments/environment';

const BASE_URL = `${environment.apiUrl}/api/n8n`;

function buildPayload(turn: BotTurnPayload) {
  const conversation_history = turn.history.map((m) => ({ role: m.role, content: m.text }));
  return {
    session_id: turn.sessionId,
    tax_state: turn.taxState,
    empty_fields: turn.emptyFields,
    last_user_input: turn.userText,
    conversation_history,
  };
}

@Injectable({ providedIn: 'root' })
export class ChatBootstrapService {
  constructor(private readonly http: HttpClient) {}

  // Sends the initial context to the bot once; shared so repeated subscribers reuse the same request.
  initializeSession(turn: BotTurnPayload): Observable<BotChatResponse> {
  const started = performance.now();

  const payload = buildPayload(turn);

  console.log('[Bootstrap] Sending request', {
    url: `${BASE_URL}/chat/fillforms`,
    payload,
  });

  return this.http
    .post<any>(`${BASE_URL}/chat/fillforms`, payload)
    .pipe(
      tap(() => {
        console.log(
          '[Bootstrap] Request sent',
          Math.round(performance.now() - started),
          'ms',
        );
      }),

      timeout(20000),

      // 🔍 RAW RESPONSE (tal cual llega)
      tap((raw) => {
        console.log('[Bootstrap] Raw response (as received):', raw);
        console.log('[Bootstrap] Raw response typeof:', typeof raw);
        console.log(
          '[Bootstrap] Raw response keys:',
          raw && typeof raw === 'object' ? Object.keys(raw) : 'not-an-object',
        );
        try {
          console.log(
            '[Bootstrap] Raw response JSON:',
            JSON.stringify(raw, null, 2),
          );
        } catch (e) {
          console.warn('[Bootstrap] Raw response not serializable', e);
        }
      }),

      map((res) => {
        const mapped = this.mapResponse(res);

        console.log('[Bootstrap] Mapped response:', mapped);
        try {
          console.log(
            '[Bootstrap] Mapped response JSON:',
            JSON.stringify(mapped, null, 2),
          );
        } catch (e) {
          console.warn('[Bootstrap] Mapped response not serializable', e);
        }

        return mapped;
      }),

      tap((mapped) => {
        console.log(
          '[Bootstrap] Roundtrip completed in',
          Math.round(performance.now() - started),
          'ms',
        );
        console.log('[Bootstrap] Final response delivered to UI:', mapped);
      }),

      catchError((err) => {
        console.error('[Bootstrap] Request failed', {
          error: err,
          elapsedMs: Math.round(performance.now() - started),
        });
        return of({ chat_message: undefined });
      }),

      shareReplay(1),
    );
}


  // Sends a user turn to the bot and returns the assistant reply.
  sendUserMessage(turn: BotTurnPayload): Observable<BotChatResponse> {
  const started = performance.now();

  const payload = buildPayload(turn);

  console.log('[Chat] Sending user message', {
    url: `${BASE_URL}/chat/fillforms`,
    payload,
  });

  return this.http
    .post<any>(`${BASE_URL}/chat/fillforms`, payload)
    .pipe(
      tap(() => {
        console.log(
          '[Chat] Request sent',
          Math.round(performance.now() - started),
          'ms',
        );
      }),

      timeout(20000),

      // 🔍 RAW RESPONSE
      tap((raw) => {
        console.log('[Chat] Raw response (as received):', raw);
        console.log('[Chat] Raw response typeof:', typeof raw);
        console.log(
          '[Chat] Raw response keys:',
          raw && typeof raw === 'object' ? Object.keys(raw) : 'not-an-object',
        );
        try {
          console.log(
            '[Chat] Raw response JSON:',
            JSON.stringify(raw, null, 2),
          );
        } catch (e) {
          console.warn('[Chat] Raw response not serializable', e);
        }
      }),

      map((res) => {
        const mapped = this.mapResponse(res);

        console.log('[Chat] Mapped response:', mapped);
        try {
          console.log(
            '[Chat] Mapped response JSON:',
            JSON.stringify(mapped, null, 2),
          );
        } catch (e) {
          console.warn('[Chat] Mapped response not serializable', e);
        }

        return mapped;
      }),

      tap((mapped) => {
        console.log(
          '[Chat] Roundtrip completed in',
          Math.round(performance.now() - started),
          'ms',
        );
        console.log('[Chat] Final response delivered to UI:', mapped);
      }),

      catchError((err) => {
        console.error('[Chat] Request failed', {
          error: err,
          elapsedMs: Math.round(performance.now() - started),
        });
        return of({ chat_message: undefined });
      }),
    );
}


  private mapResponse(res: any): BotChatResponse {
    const output = Array.isArray(res) ? res[0]?.output : res?.output ?? res;
    if (!output) return { chat_message: undefined } as BotChatResponse;

    const stateTax = output.state?.tax_state || output.state;

    return {
      chat_message: output.chat_message || output.next_question?.text,
      fields: output.fields || output.filled_fields || stateTax,
      next_question: output.next_question,
      is_complete: output.is_complete,
      session_id: output.state?.session_id || output.session_id,
    };
  }
}
