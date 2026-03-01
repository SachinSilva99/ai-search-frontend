import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    this.applyTheme(this.getTheme());
  }

  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
  }

  toggleTheme(): void {
    const newTheme = this.getTheme() === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(this.THEME_KEY, theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}
