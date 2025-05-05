import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import Fuse from 'fuse.js';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Product } from '../../models/product.model';
import rawProducts from '../../../assets/catalog.json';

import { SearchService } from '../../services/search.service'; // adjust path if needed
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Required for *ngIf, *ngFor, ngModel
  templateUrl: './search.component.html',
})

export class SearchComponent implements OnInit {
  query: string = '';
  results: Product[] = [];
  categories: string[] = [];

  allProducts: Product[] = rawProducts as Product[];
  fuse!: Fuse<Product>; // 🔍 the fuzzy search engine

  search$ = new Subject<string>();
  selectedCategory: string = 'All';


  constructor(private searchService: SearchService, private router: Router) {
  }

  ngOnInit(): void {
    this.categories = [
      ...new Set(this.allProducts.map((p) => p['Main Category Name']))
    ];
  
    // ✅ Set up Fuse
    this.fuse = new Fuse(this.allProducts, {
      keys: ['Name of product', 'Brand name'],
      threshold: 0.4, // Adjust sensitivity
    });
  
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.query = value;
        this.filterProducts();
      });
  }
  
  filterProducts(): void {
    const q = this.query.trim();
    if (!q) {
      this.results = [];
      return;
    }
  
    const fuseResults = this.fuse.search(q);
    this.results = fuseResults.map(r => r.item).slice(0, 5);
  }

  triggerSearch() {
  this.searchService.triggerSearch({
    query: this.query,
    // category: this.selectedCategory
  });
  this.router.navigate(['/products']);  
  this.results = []; // 👈 hides the dropdown
}

triggerSearchFromResult(name: string) {
  this.query = name;
  this.results = [];
  this.searchService.triggerSearch({ query: name });
  this.router.navigate(['/products']);
}

  
}
