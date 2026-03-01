import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { CartService } from '../../services/cart.service';
import { StoredUser } from '../../models/models';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-layout.component.html'
})
export class CustomerLayoutComponent implements OnInit {
  currentUser: StoredUser | null = null;
  cartCount = 0;

  constructor(
    private authService: AuthService,
    public themeService: ThemeService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadCartCount();
      } else {
        this.cartCount = 0;
      }
    });
  }

  loadCartCount(): void {
    this.cartService.getCart().subscribe({
      next: cart => this.cartCount = cart.totalItems,
      error: () => this.cartCount = 0
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
