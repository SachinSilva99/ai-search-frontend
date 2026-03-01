import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ProductDto } from '../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: ProductDto | null = null;
  loading: boolean = true;
  quantity: number = 1;
  addingToCart: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe({
      next: p => { this.product = p; this.loading = false; },
      error: () => { this.loading = false; this.router.navigate(['/products']); }
    });
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.toast.warning('Please login to add items to cart');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.product) return;
    this.addingToCart = true;
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.toast.success('Added to cart!');
        this.addingToCart = false;
      },
      error: () => {
        this.toast.error('Failed to add to cart');
        this.addingToCart = false;
      }
    });
  }
}
