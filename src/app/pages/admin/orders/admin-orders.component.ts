import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { OrderResponse } from '../../../models/models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  statusFilter = '';
  currentPage = 0;
  totalPages = 0;

  constructor(private adminService: AdminService, private toast: ToastService) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    this.loading = true;
    this.adminService.getOrders(this.currentPage, 20, this.statusFilter || undefined).subscribe({
      next: res => { this.orders = res.content; this.totalPages = res.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.currentPage = 0;
    this.loadOrders();
  }

  updateStatus(order: OrderResponse, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value;
    
    this.adminService.updateOrderStatus(order.orderId, newStatus).subscribe({
      next: updated => {
        this.toast.success(`Order #${order.orderId} status updated to ${newStatus}`);
        order.orderStatus = updated.orderStatus;
      },
      error: () => {
        this.toast.error('Failed to update order status');
        // Revert select on error
        target.value = order.orderStatus;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) { this.currentPage = page; this.loadOrders(); }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  }
}
