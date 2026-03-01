import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/models';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.component.html'
})
export class OrderHistoryComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: orders => { this.orders = orders; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
