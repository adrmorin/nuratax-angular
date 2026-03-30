import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private credentialSubject = new BehaviorSubject<string | null>(null);
  credential$ = this.credentialSubject.asObservable();
  private initialized = false;
  private scriptLoading = false;

  constructor(private zone: NgZone) {}

  init(clientId: string = environment.googleClientId) {
    if (this.initialized) return;
    if (!(window as any).google) {
      this.loadScript(() => this.init(clientId));
      return;
    }
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        this.zone.run(() => this.credentialSubject.next(response?.credential || null));
      },
    });
    this.initialized = true;
  }

  renderButton(element: HTMLElement) {
    if (!element) return;
    if (!(window as any).google) {
      this.loadScript(() => this.renderButton(element));
      return;
    }
    this.init();
    if (!(window as any).google?.accounts?.id?.renderButton) return;
    google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
    });
  }

  promptOneTap() {
    this.init();
    google?.accounts?.id?.prompt?.();
  }

  revoke() {
    if (!environment.googleClientId) return;
    google?.accounts?.id?.revoke?.(environment.googleClientId, () => {
      this.zone.run(() => this.credentialSubject.next(null));
    });
  }

  private loadScript(onload?: () => void) {
    if (this.scriptLoading || (window as any).google) return;
    this.scriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.scriptLoading = false;
      if (onload) onload();
    };
    script.onerror = () => {
      this.scriptLoading = false;
      console.error('Failed to load Google Identity Services script');
    };
    document.head.appendChild(script);
  }
}
