import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductDto, Category, PaginatedResponse } from '../../models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  categories: Category[] = [];
  selectedCategory?: string;
  loading = true;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(cats => this.categories = cats);
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'];
      this.currentPage = 0;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.currentPage, 12, this.selectedCategory).subscribe({
      next: res => {
        this.products = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filterByCategory(code?: string): void {
    this.selectedCategory = code;
    this.currentPage = 0;
    this.loadProducts();
  }

  getCategoryName(): string {
    return this.categories.find(c => c.categoryCode === this.selectedCategory)?.categoryName || 'Products';
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  }
}
