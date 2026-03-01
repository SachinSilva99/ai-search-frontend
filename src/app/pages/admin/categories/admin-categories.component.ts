import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { Category } from '../../../models/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  showModal = false;
  editing = false;
  editCode = '';
  saving = false;
  
  categoryForm!: FormGroup;
  
  showDeleteConfirm = false;
  deleteTarget: Category | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private adminService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void { 
    this.categoryForm = this.fb.group({
      categoryCode: ['', Validators.required],
      categoryName: ['', Validators.required],
      description: ['']
    });
    this.loadCategories(); 
  }

  loadCategories(): void {
    this.loading = true;
    this.productService.getCategories().subscribe({
      next: cats => { this.categories = cats; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openModal(): void {
    this.editing = false;
    this.categoryForm.reset();
    this.categoryForm.get('categoryCode')?.enable();
    this.showModal = true;
  }

  editCategory(cat: Category): void {
    this.editing = true;
    this.editCode = cat.categoryCode;
    this.categoryForm.patchValue({
      categoryCode: cat.categoryCode,
      categoryName: cat.categoryName,
      description: cat.description
    });
    this.categoryForm.get('categoryCode')?.disable(); // Prevent editing the primary key
    this.showModal = true;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;
    this.saving = true;
    const formVal = this.categoryForm.getRawValue(); // Get all values including disabled
    
    const obs = this.editing
      ? this.adminService.updateCategory(this.editCode, formVal)
      : this.adminService.createCategory(formVal);
      
    obs.subscribe({
      next: () => { 
        this.toast.success(this.editing ? 'Category updated!' : 'Category created!'); 
        this.showModal = false; 
        this.saving = false; 
        this.loadCategories(); 
      },
      error: () => { this.toast.error('Operation failed'); this.saving = false; }
    });
  }

  confirmDelete(cat: Category): void {
    this.deleteTarget = cat;
    this.showDeleteConfirm = true;
  }

  doDelete(): void {
    if (!this.deleteTarget) return;
    this.adminService.deleteCategory(this.deleteTarget.categoryCode).subscribe({
      next: () => { this.toast.success('Category deleted'); this.showDeleteConfirm = false; this.loadCategories(); },
      error: () => this.toast.error('Failed to delete category')
    });
  }
}
