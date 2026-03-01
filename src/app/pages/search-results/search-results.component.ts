import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchResult } from '../../models/models';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnInit {
  results: SearchResult[] = [];
  searchQuery = '';
  lastQuery = '';
  loading = false;
  searched = false;

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query params changed:', params);
      if (params['q'] && params['q'] !== this.lastQuery) {
        this.searchQuery = params['q'];
        this.doSearch();
      }
    });
  }

  onSearch(): void {
    console.log('onSearch called with:', this.searchQuery);
    if (this.searchQuery.trim()) {
      if (this.searchQuery === this.lastQuery) {
          // Force search anyway if it's the exact same query but they clicked search again
          this.doSearch();
      } else {
          this.router.navigate([], { 
            relativeTo: this.route, 
            queryParams: { q: this.searchQuery } 
          });
      }
    }
  }

  private doSearch(): void {
    console.log('doSearch starting for:', this.searchQuery);
    this.loading = true;
    this.searched = true;
    this.lastQuery = this.searchQuery;
    this.searchService.search(this.searchQuery, 10).subscribe({
      next: res => { this.results = res; this.loading = false; },
      error: () => { this.results = []; this.loading = false; }
    });
  }

  getConfidenceClass(score: number): string {
    if (score >= 0.7) return 'confidence-high';
    if (score >= 0.4) return 'confidence-med';
    return 'confidence-low';
  }
}
