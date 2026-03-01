import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, AdminDashboard, ProductDto, Category, UserProfile, OrderResponse, PaginatedResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboard(): Observable<AdminDashboard> {
    return this.http.get<ApiResponse<AdminDashboard>>('/api/admin/dashboard')
      .pipe(map(res => res.data));
  }

  // Products
  createProduct(data: any): Observable<ProductDto> {
    return this.http.post<ApiResponse<ProductDto>>('/api/admin/products', data)
      .pipe(map(res => res.data));
  }

  updateProduct(id: number, data: any): Observable<ProductDto> {
    return this.http.put<ApiResponse<ProductDto>>(`/api/admin/products/${id}`, data)
      .pipe(map(res => res.data));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`/api/admin/products/${id}`);
  }

  // Categories
  createCategory(data: any): Observable<Category> {
    return this.http.post<ApiResponse<Category>>('/api/admin/categories', data)
      .pipe(map(res => res.data));
  }

  updateCategory(code: string, data: any): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`/api/admin/categories/${code}`, data)
      .pipe(map(res => res.data));
  }

  deleteCategory(code: string): Observable<any> {
    return this.http.delete(`/api/admin/categories/${code}`);
  }

  // Users
  getUsers(page: number = 0, size: number = 20): Observable<PaginatedResponse<UserProfile>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ApiResponse<PaginatedResponse<UserProfile>>>('/api/admin/users', { params })
      .pipe(map(res => res.data));
  }

  getUser(id: number): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>(`/api/admin/users/${id}`)
      .pipe(map(res => res.data));
  }

  updateUserRole(id: number, role: string): Observable<UserProfile> {
    return this.http.put<ApiResponse<UserProfile>>(`/api/admin/users/${id}/role`, { role })
      .pipe(map(res => res.data));
  }

  // Orders
  getOrders(page: number = 0, size: number = 20, status?: string): Observable<PaginatedResponse<OrderResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<PaginatedResponse<OrderResponse>>>('/api/admin/orders', { params })
      .pipe(map(res => res.data));
  }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<ApiResponse<OrderResponse>>(`/api/admin/orders/${id}`)
      .pipe(map(res => res.data));
  }

  updateOrderStatus(id: number, newStatus: string): Observable<OrderResponse> {
    return this.http.put<ApiResponse<OrderResponse>>(`/api/admin/orders/${id}/status`, { newStatus })
      .pipe(map(res => res.data));
  }
}
