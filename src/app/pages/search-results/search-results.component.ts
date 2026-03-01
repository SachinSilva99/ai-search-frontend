import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchResult, ProductDto } from '../../models/models';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  results: SearchResult[] = [];
  titleResults: ProductDto[] = [];
  searchQuery = '';
  lastQuery = '';
  loading = false;
  searched = false;
  searchMode: 'ai' | 'title' = 'ai';

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q'] && params['q'] !== this.lastQuery) {
        this.searchQuery = params['q'];
        if (params['mode'] === 'title') {
          this.searchMode = 'title';
        }
        this.doSearch();
      }
    });
  }

  setSearchMode(mode: 'ai' | 'title'): void {
    this.searchMode = mode;
    if (this.searchQuery.trim()) {
      this.doSearch();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      if (this.searchQuery === this.lastQuery) {
        this.doSearch();
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: this.searchQuery, mode: this.searchMode }
        });
      }
    }
  }

  private doSearch(): void {
    this.loading = true;
    this.searched = true;
    this.lastQuery = this.searchQuery;
    this.results = [];
    this.titleResults = [];

    if (this.searchMode === 'ai') {
      this.searchService.search(this.searchQuery, 10).subscribe({
        next: res => { this.results = res; this.loading = false; },
        error: () => { this.results = []; this.loading = false; }
      });
    } else {
      this.searchService.searchByTitle(this.searchQuery).subscribe({
        next: res => { this.titleResults = res; this.loading = false; },
        error: () => { this.titleResults = []; this.loading = false; }
      });
    }
  }

  getConfidenceClass(score: number): string {
    if (score >= 0.7) return 'confidence-high';
    if (score >= 0.4) return 'confidence-med';
    return 'confidence-low';
  }

  get hasResults(): boolean {
    return this.searchMode === 'ai' ? this.results.length > 0 : this.titleResults.length > 0;
  }

  get resultCount(): number {
    return this.searchMode === 'ai' ? this.results.length : this.titleResults.length;
  }
}
