import { Injectable } from '@angular/core';

interface StoredProfile {
    email: string;
    firstName: string;
    lastName: string;
}

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    private readonly tokenKey = 'token';
    private readonly expiryKey = 'token_expiry';
    private readonly fallbackEmailKey = 'fallback_email';
    private readonly fallbackFirstNameKey = 'fallback_firstName';
    private readonly fallbackLastNameKey = 'fallback_lastName';
    private readonly defaultLifetimeMs = 24 * 60 * 60 * 1000;

    getToken(): string | null {
        return this.storage?.getItem(this.tokenKey) || null;
    }

    getTokenExpiry(): number | null {
        const raw = this.storage?.getItem(this.expiryKey);
        if (!raw) return null;

        const parsed = Number.parseInt(raw, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    hasValidToken(): boolean {
        const token = this.getToken();
        const expiry = this.getTokenExpiry();

        if (!token || !expiry) {
            return false;
        }

        return Date.now() < expiry;
    }

    saveSession(token: string, profile?: Partial<StoredProfile>): void {
        if (!this.storage) return;

        this.storage.setItem(this.tokenKey, token);
        this.storage.setItem(this.expiryKey, this.resolveExpiry(token).toString());

        if (profile?.email) this.storage.setItem(this.fallbackEmailKey, profile.email);
        if (profile?.firstName) this.storage.setItem(this.fallbackFirstNameKey, profile.firstName);
        if (profile?.lastName) this.storage.setItem(this.fallbackLastNameKey, profile.lastName);
    }

    getFallbackProfile(): StoredProfile {
        return {
            email: this.storage?.getItem(this.fallbackEmailKey) || '',
            firstName: this.storage?.getItem(this.fallbackFirstNameKey) || '',
            lastName: this.storage?.getItem(this.fallbackLastNameKey) || ''
        };
    }

    clearSession(): void {
        if (!this.storage) return;

        this.storage.removeItem(this.tokenKey);
        this.storage.removeItem(this.expiryKey);
        this.storage.removeItem(this.fallbackEmailKey);
        this.storage.removeItem(this.fallbackFirstNameKey);
        this.storage.removeItem(this.fallbackLastNameKey);
    }

    private get storage(): Storage | null {
        if (typeof localStorage === 'undefined') {
            return null;
        }

        return localStorage;
    }

    private resolveExpiry(token: string): number {
        const jwtExpiry = this.decodeJwtExpiry(token);
        if (jwtExpiry) {
            return jwtExpiry;
        }

        return Date.now() + this.defaultLifetimeMs;
    }

    private decodeJwtExpiry(token: string): number | null {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;

            const normalized = parts[1]
                .replace(/-/g, '+')
                .replace(/_/g, '/')
                .padEnd(Math.ceil(parts[1].length / 4) * 4, '=');

            const payload = JSON.parse(atob(normalized)) as { exp?: number };
            if (!payload.exp) return null;

            return payload.exp * 1000;
        } catch {
            return null;
        }
    }
}
