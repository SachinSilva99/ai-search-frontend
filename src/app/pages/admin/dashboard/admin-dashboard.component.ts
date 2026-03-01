import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AdminDashboard } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  dashboard: AdminDashboard | null = null;
  loading = true;
  maxSales = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: d => {
        this.dashboard = d;
        if (d.monthlySales.length > 0) {
          this.maxSales = Math.max(...d.monthlySales.map(m => m.totalSales), 1);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getBarHeight(sales: number): number {
    return (sales / this.maxSales) * 100;
  }

  getMonthName(month: number): string {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month] || '';
  }

  getStatusEntries(): { key: string; value: number }[] {
    if (!this.dashboard) return [];
    return Object.entries(this.dashboard.ordersByStatus).map(([key, value]) => ({ key, value }));
  }
}
