import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    theme = signal<Theme>('light');

    constructor() {
        // Load from local storage or default to light (as per request "current is light")
        const storedTheme = localStorage.getItem('theme') as Theme;
        if (storedTheme) {
            this.theme.set(storedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Optional: Auto-detect, but user implied "currently light", so maybe default to light?
            // Let's respect system pref if no storage, but prioritize explicit user choice.
            this.theme.set('dark');
        }

        // Apply theme effect
        effect(() => {
            const currentTheme = this.theme();
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    toggleTheme() {
        this.theme.update(t => t === 'light' ? 'dark' : 'light');
    }

    setTheme(newTheme: Theme) {
        this.theme.set(newTheme);
    }
}
