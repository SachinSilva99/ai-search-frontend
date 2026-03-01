import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { ProductDto, SearchResult } from '../../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  products: ProductDto[] = [];
  searchQuery = '';
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getProducts(0, 8).subscribe({
      next: res => { this.products = res.content; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }
}
