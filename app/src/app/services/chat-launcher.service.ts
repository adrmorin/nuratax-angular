import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ChatAction =
    | { type: 'open' }
    | { type: 'openAndSend'; message: string };

@Injectable({ providedIn: 'root' })
export class ChatLauncherService {
    private _actions$ = new Subject<ChatAction>();
    readonly actions$ = this._actions$.asObservable();

    open() {
        this._actions$.next({ type: 'open' });
    }
    openAndSend(message: string) {
        this._actions$.next({ type: 'openAndSend', message });
    }
}
