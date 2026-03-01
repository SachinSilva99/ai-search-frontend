import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { UserProfile } from '../../../models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: UserProfile[] = [];
  loading = true;
  currentPage = 0;
  totalPages = 0;

  constructor(private adminService: AdminService, private toast: ToastService) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getUsers(this.currentPage, 20).subscribe({
      next: res => { this.users = res.content; this.totalPages = res.totalPages; this.loading = false; },
      error: () => this.loading = false
    });
  }

  changeRole(user: UserProfile, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newRole = target.value;
    
    this.adminService.updateUserRole(user.id, newRole).subscribe({
      next: () => { this.toast.success(`${user.firstName}'s role updated to ${newRole}`); user.role = newRole; },
      error: () => {
        this.toast.error('Failed to update role');
        // Revert select on error
        target.value = user.role;
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) { this.currentPage = page; this.loadUsers(); }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  }
}
