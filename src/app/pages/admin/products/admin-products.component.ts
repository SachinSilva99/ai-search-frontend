import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { ProductDto, Category } from '../../../models/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit {
  products: ProductDto[] = [];
  categories: Category[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;

  searchControl = new FormControl('');

  showModal = false;
  editing = false;
  editId = 0;
  saving = false;
  
  productForm!: FormGroup;

  showDeleteConfirm = false;
  deleteTarget: ProductDto | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private adminService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imageUrl: [''],
      categoryCode: ['', Validators.required]
    });

    this.productService.getCategories().subscribe(cats => this.categories = cats);
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts(this.currentPage, 20).subscribe({
      next: res => {
        this.products = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  filteredProducts(): ProductDto[] {
    const term = (this.searchControl.value || '').toLowerCase();
    if (!term.trim()) return this.products;
    return this.products.filter(p => p.name.toLowerCase().includes(term) || p.categoryName.toLowerCase().includes(term));
  }

  openModal(): void {
    this.editing = false;
    this.productForm.reset({ price: 0, categoryCode: '' });
    this.showModal = true;
  }

  editProduct(p: ProductDto): void {
    this.editing = true;
    this.editId = p.id;
    this.productForm.patchValue({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      categoryCode: p.categoryCode
    });
    this.showModal = true;
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.toast.warning('Please fill in all required fields correctly');
      return;
    }
    this.saving = true;
    const formVal = this.productForm.value;
    
    const obs = this.editing
      ? this.adminService.updateProduct(this.editId, formVal)
      : this.adminService.createProduct(formVal);
      
    obs.subscribe({
      next: () => {
        this.toast.success(this.editing ? 'Product updated!' : 'Product created!');
        this.showModal = false;
        this.saving = false;
        this.loadProducts();
      },
      error: () => { this.toast.error('Operation failed'); this.saving = false; }
    });
  }

  confirmDelete(p: ProductDto): void {
    this.deleteTarget = p;
    this.showDeleteConfirm = true;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.adminService.deleteProduct(this.deleteTarget.id).subscribe({
      next: () => { this.toast.success('Product deleted'); this.showDeleteConfirm = false; this.loadProducts(); },
      error: () => this.toast.error('Failed to delete product')
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) { this.currentPage = page; this.loadProducts(); }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  }
}
