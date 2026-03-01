import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, UserProfile } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>('/api/user/profile')
      .pipe(map(res => res.data));
  }

  updateProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<ApiResponse<UserProfile>>('/api/user/profile', data)
      .pipe(map(res => res.data));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<ApiResponse<any>>('/api/user/change-password', { currentPassword, newPassword });
  }
}
