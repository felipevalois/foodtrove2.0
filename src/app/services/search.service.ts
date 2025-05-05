import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SearchInput {
  query: string;
  // category: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchInput = new BehaviorSubject<SearchInput | null>(null);
  searchInput$ = this.searchInput.asObservable();

  triggerSearch(input: SearchInput) {
    this.searchInput.next(input);
  }
}
