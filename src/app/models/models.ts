// API Response envelope
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  firstName: string;
  email: string;
  role: string;
}

// Product
export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryCode: string;
  categoryName: string;
}

export interface Category {
  categoryCode: string;
  categoryName: string;
  description: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}

// Search
export interface SearchResult {
  productId: number;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryCode: string;
  categoryName: string;
  confidenceScore: number;
}

// Cart
export interface CartResponse {
  items: CartItemResponse[];
  totalAmount: number;
  totalItems: number;
}

export interface CartItemResponse {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl: string;
}

// Orders
export interface OrderResponse {
  orderId: number;
  orderStatus: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// User
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

// Admin Dashboard
export interface AdminDashboard {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: { [key: string]: number };
  monthlySales: MonthlySales[];
  recentOrders: OrderResponse[];
}

export interface MonthlySales {
  year: number;
  month: number;
  totalSales: number;
  orderCount: number;
}

// Stored user info
export interface StoredUser {
  userId: number;
  firstName: string;
  email: string;
  role: string;
}
