import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, OrderResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(shippingAddress: string, paymentMethod: string): Observable<OrderResponse> {
    return this.http.post<ApiResponse<OrderResponse>>('/api/orders', { shippingAddress, paymentMethod })
      .pipe(map(res => res.data));
  }

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<ApiResponse<OrderResponse[]>>('/api/orders')
      .pipe(map(res => res.data));
  }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<ApiResponse<OrderResponse>>(`/api/orders/${id}`)
      .pipe(map(res => res.data));
  }
}
