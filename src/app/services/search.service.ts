import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, SearchResult } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string, limit: number = 5): Observable<SearchResult[]> {
    return this.http.post<ApiResponse<SearchResult[]>>('/api/search', { query, limit })
      .pipe(map(res => res.data));
  }
}
