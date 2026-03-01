import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { OrderResponse } from '../../models/models';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
  order: OrderResponse | null = null;
  loading = true;

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrder(id).subscribe({
      next: o => { this.order = o; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
