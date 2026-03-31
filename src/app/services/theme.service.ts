import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDarkMode = signal<boolean>(this.getInitialTheme());

    constructor() {
        effect(() => {
            if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
                const mode = this.isDarkMode();
                if (mode) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }
            }
        });
    }

    private getInitialTheme(): boolean {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false; // Default to light mode on server
    }

    toggleTheme() {
        this.isDarkMode.update(v => !v);
    }
}
