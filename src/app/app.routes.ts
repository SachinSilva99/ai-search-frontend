import { Routes } from '@angular/router';
import { CustomerLayoutComponent } from './layouts/customer-layout/customer-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Customer routes
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'products', loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.ProductListComponent) },
      { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
      { path: 'search', loadComponent: () => import('./pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },
      { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
      // Protected customer routes
      { path: 'cart', canActivate: [authGuard], loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/order-history/order-history.component').then(m => m.OrderHistoryComponent) },
      { path: 'orders/:id', canActivate: [authGuard], loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent) },
      { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },
  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'products', loadComponent: () => import('./pages/admin/products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'categories', loadComponent: () => import('./pages/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'orders', loadComponent: () => import('./pages/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  // 404
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
