import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, ProductDto, Category, PaginatedResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(page: number = 0, size: number = 12, categoryCode?: string): Observable<PaginatedResponse<ProductDto>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (categoryCode) params = params.set('categoryCode', categoryCode);
    return this.http.get<ApiResponse<PaginatedResponse<ProductDto>>>('/api/products', { params })
      .pipe(map(res => res.data));
  }

  getProduct(id: number): Observable<ProductDto> {
    return this.http.get<ApiResponse<ProductDto>>(`/api/products/${id}`)
      .pipe(map(res => res.data));
  }

  getProductsByCategory(code: string): Observable<ProductDto[]> {
    return this.http.get<ApiResponse<ProductDto[]>>(`/api/products/category/${code}`)
      .pipe(map(res => res.data));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>('/api/categories')
      .pipe(map(res => res.data));
  }
}
