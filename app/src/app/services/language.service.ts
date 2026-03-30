import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

type SupportedLanguage = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class LanguageService {
    private readonly translate = inject(TranslateService);
    private readonly document = inject(DOCUMENT);
    private readonly storageKey = 'app_language';
    private readonly defaultLanguage: SupportedLanguage = 'en';
    private readonly supportedLanguages: SupportedLanguage[] = ['en', 'es'];

    initialize(): void {
        this.translate.setDefaultLang(this.defaultLanguage);
        this.setLanguage(this.defaultLanguage, false);
    }

    setLanguage(lang: string, persist = true): void {
        const normalized = this.normalizeLanguage(lang);
        this.translate.use(normalized);
        this.document.documentElement.lang = normalized;

        if (persist && typeof localStorage !== 'undefined') {
            localStorage.setItem(this.storageKey, normalized);
        }
    }

    toggleLanguage(): void {
        this.setLanguage(this.currentLanguage === 'en' ? 'es' : 'en');
    }

    get currentLanguage(): SupportedLanguage {
        return this.normalizeLanguage(this.translate.currentLang || this.translate.defaultLang || this.defaultLanguage);
    }

    private normalizeLanguage(lang: string): SupportedLanguage {
        const shortLang = (lang || '').toLowerCase().slice(0, 2) as SupportedLanguage;
        return this.supportedLanguages.includes(shortLang) ? shortLang : this.defaultLanguage;
    }
}
