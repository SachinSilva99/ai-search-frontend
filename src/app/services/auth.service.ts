import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiResponse, LoginRequest, LoginResponse, OtpResponse, OtpVerifyRequest, StoredUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<StoredUser | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  /** Step 1: send email+password → backend validates and sends OTP */
  login(req: LoginRequest): Observable<ApiResponse<OtpResponse>> {
    return this.http.post<ApiResponse<OtpResponse>>('/api/auth/login', req);
  }

  /** Step 2: verify OTP → get JWT token */
  verifyOtp(req: OtpVerifyRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>('/api/auth/login/verify-otp', req).pipe(
      tap(res => {
        if (res.status === 'success') {
          localStorage.setItem('token', res.data.token);
          const user: StoredUser = {
            userId: res.data.userId,
            firstName: res.data.firstName,
            email: res.data.email,
            role: res.data.role
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(req: any): Observable<ApiResponse<{ userId: number }>> {
    return this.http.post<ApiResponse<{ userId: number }>>('/api/auth/register', req);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.role === 'ADMIN';
  }

  getCurrentUser(): StoredUser | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): StoredUser | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
