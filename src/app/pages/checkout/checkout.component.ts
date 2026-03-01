import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { CartResponse } from '../../models/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  cart: CartResponse | null = null;
  loading = true;
  placing = false;
  submitted = false;

  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      paymentMethod: ['CASH_ON_DELIVERY', Validators.required]
    });

    this.cartService.getCart().subscribe({
      next: cart => { this.cart = cart; this.loading = false; },
      error: () => this.loading = false
    });
  }

  get f() { return this.checkoutForm.controls; }

  placeOrder(): void {
    this.submitted = true;
    if (this.checkoutForm.invalid) return;
    
    this.placing = true;
    const val = this.checkoutForm.value;
    
    this.orderService.placeOrder(val.shippingAddress, val.paymentMethod).subscribe({
      next: order => {
        this.toast.success('Order placed successfully!');
        this.router.navigate(['/orders', order.orderId]);
      },
      error: () => {
        this.toast.error('Failed to place order');
        this.placing = false;
      }
    });
  }
}
