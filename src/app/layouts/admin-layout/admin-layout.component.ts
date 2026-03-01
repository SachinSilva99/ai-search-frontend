import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  sidebarOpen = false;

  constructor(
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
