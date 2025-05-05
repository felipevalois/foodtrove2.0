import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 required for *ngFor, *ngIf
import { FiltersComponent } from '../filters/filters.component'; // 👈 if standalone
import { ProductCardComponent } from '../product-card/product-card.component'; // 👈 if standalone
import { SearchService, SearchInput } from '../../services/search.service';
import { Product } from '../../models/product.model'; // adjust path if needed
import rawProducts from '../../../assets/catalog.json'; // adjust if needed
import { Subscription } from 'rxjs';
import Fuse from 'fuse.js';
import { KevelService } from '../../services/kevel.service';
import { AdRequestEditorComponent } from '../ad-request-editor/ad-request-editor.component'; // ✅

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'], // ✅ note the plural
  imports: [CommonModule, FiltersComponent, ProductCardComponent, AdRequestEditorComponent] // ✅ add ProductCardComponent etc. here if standalone
})
export class ProductListComponent implements OnInit, OnDestroy {
  allProducts: Product[] = rawProducts as Product[];
  filteredProducts: Product[] = [];
  fuse!: Fuse<Product>;
  bannerAd: any;
  showEditor = false;
  editorInput: {
    requestJson: any;
    onSave: (updatedAd: any) => void;
  } | null = null;
  private sub!: Subscription;
    noop = () => {};


  constructor(private searchService: SearchService, private kevel: KevelService) {}

  ngOnInit(): void {
    this.filteredProducts = this.allProducts;
    
    // set up Fuse
    this.fuse = new Fuse(this.allProducts, {
      keys: ['Name of product', 'Brand name'],
      threshold: 0.4,
    });
    
    this.sub = this.searchService.searchInput$.subscribe((input) => {
      if (input) this.applySearch(input);
    });

    const body = {
      user: { key: '9d5ada47-7f73-49ab-8268-8d0195ee75fd' },
      enableBotFiltering: true,
      consent: { gdpr: true },
      placements: [
        {
          divName: 'banner',
          networkId: 11580,
          siteId: 1294553,
          adTypes: [123],
          zoneIds: [323274]
        }
      ]
    };

    this.sub.add(
      this.kevel.getBannerAd(body).subscribe(res => {
        const ad = res?.decisions?.banner;
        if (ad) {
          this.bannerAd = ad;
          this.kevel.trackImpression(ad.impressionUrl);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  applySearch({ query }: SearchInput): void {
    const q = query.trim();
    // const cat = category;

    if (!q) {
      this.filteredProducts = this.allProducts;
      return;
    }
  
    const fuseResults = this.fuse.search(q);
    this.filteredProducts = fuseResults.map(r => r.item);
  }

  openEditor(adData: any) {
    this.editorInput = {
      requestJson: this.kevel.getLastRequest(), // previously sent body
      onSave: (updatedAd) => {
        this.showEditor = false;
        if (!updatedAd) return;
  
        this.bannerAd = updatedAd;
        this.kevel.trackImpression(updatedAd.impressionUrl);
      }
    };
    this.showEditor = true;
  }
  
}
