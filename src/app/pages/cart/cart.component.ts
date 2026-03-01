import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CartResponse, CartItemResponse } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart: CartResponse | null = null;
  loading = true;

  constructor(
    private cartService: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: cart => { this.cart = cart; this.loading = false; },
      error: () => this.loading = false
    });
  }

  updateQty(item: CartItemResponse, newQty: number): void {
    if (newQty < 1) return;
    this.cartService.updateCartItem(item.cartItemId, newQty).subscribe({
      next: () => this.loadCart(),
      error: () => this.toast.error('Failed to update quantity')
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeCartItem(itemId).subscribe({
      next: () => { this.toast.success('Item removed'); this.loadCart(); },
      error: () => this.toast.error('Failed to remove item')
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => { this.toast.success('Cart cleared'); this.loadCart(); },
      error: () => this.toast.error('Failed to clear cart')
    });
  }
}
