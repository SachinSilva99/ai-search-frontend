import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, CartResponse, CartItemResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}

  getCart(): Observable<CartResponse> {
    return this.http.get<ApiResponse<CartResponse>>('/api/cart')
      .pipe(map(res => res.data));
  }

  addToCart(productId: number, quantity: number): Observable<CartItemResponse> {
    return this.http.post<ApiResponse<CartItemResponse>>('/api/cart', { productId, quantity })
      .pipe(map(res => res.data));
  }

  updateCartItem(itemId: number, quantity: number): Observable<CartItemResponse> {
    return this.http.put<ApiResponse<CartItemResponse>>(`/api/cart/${itemId}`, { quantity })
      .pipe(map(res => res.data));
  }

  removeCartItem(itemId: number): Observable<any> {
    return this.http.delete(`/api/cart/${itemId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete('/api/cart');
  }
}
