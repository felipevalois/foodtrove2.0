import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 required for *ngFor, *ngIf
import { FiltersComponent } from '../filters/filters.component'; // 👈 if standalone
import { ProductCardComponent } from '../product-card/product-card.component'; // 👈 if standalone
import { SearchService, SearchInput } from '../../services/search.service';
import { Product, GPAProduct } from '../../models/product.model'; // adjust path if needed
import rawProducts from '../../../assets/catalog/catalog.json'; // adjust to catalog.json
import { Subscription } from 'rxjs';
import Fuse from 'fuse.js';
import { KevelService } from '../../services/kevel.service';
import { AdRequestEditorComponent } from '../ad-request-editor/ad-request-editor.component'; // ✅
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrandedShelfComponent, BrandStripData } from '../ads/branded-shelf/branded-shelf.component'; // ✅
import { CarouselComponent, CarouselData } from '../ads/carousel/carousel.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'], // ✅ note the plural
  imports: [CommonModule, FiltersComponent, ProductCardComponent, AdRequestEditorComponent, MatTooltipModule, BrandedShelfComponent, CarouselComponent] // ✅ add ProductCardComponent etc. here if standalone
})
export class ProductListComponent implements OnInit, OnDestroy {

  allProducts: Product[] = rawProducts as Product[];
  filteredProducts: Product[] = [];
  fuse!: Fuse<Product>;
  // allProducts: GPAProduct[] = rawProducts as GPAProduct[];
  // filteredProducts: GPAProduct[] = [];
  // fuse!: Fuse<GPAProduct>;

  bannerAd: any;
  plas: any;
  showEditor = false;

  editorInput: {
    requestJson: any;
    onSave: (updatedAd: any) => void;
  } | null = null;

  private sub!: Subscription;
  noop = () => {};


  wonderfulStrip?: BrandStripData;
  bigcash?: BrandStripData;
  carouselStrip?: CarouselData;

  constructor(private searchService: SearchService, private kevel: KevelService) {}

  ngOnInit(): void {
    this.filteredProducts = this.allProducts;
    // for (let i = 0; i < 3; i++) {
    //   this.filteredProducts[i] = {
    //     ...this.filteredProducts[i],
    //     isAd: true
    //   };
    // }
    // console.log(this.filteredProducts);
    // set up Fuse
    this.fuse = new Fuse(this.allProducts, {
      keys: ['Name of product'],
      // keys: ['name'], // OR 'brand' or 'category'
      threshold: 0.3,
    });
    
    this.sub = this.searchService.searchInput$.subscribe((input) => {
      if (input) this.applySearch(input);
    });
    this.getBanner();
    this.getPLAs();
    // this.buildBrandStrip("Wonderful");
    this.buildBrandStrip("Big Cashew Co.");
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getBanner(){
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
      this.kevel.getAd(body).subscribe(res => {
        const ad = res?.decisions?.banner;
        if (ad) {
          this.bannerAd = ad;
          // console.log(JSON.stringify(this.bannerAd));
          this.kevel.trackImpression(ad.impressionUrl);
        }
      })
    );
  }

  getPLAs() {
    const body = {
      user: { key: '9d5ada47-7f73-49ab-8268-8d0195ee75fd' },
      enableBotFiltering: true,
      consent: { gdpr: true },
      placements: [
        {
          divName: 'PLA',
          networkId: 11580,
          siteId: 1294553,
          adTypes: [320],
          count: 5
        }
      ]
    };

    this.sub.add(
      this.kevel.getAd(body).subscribe(res => {
        const plaAds = res?.decisions?.PLA as any[] | undefined;
        if (!plaAds?.length) return;

        /* map every Kevel creative → Product-like object */
        const plaProducts = plaAds.map((ad) => this.adAsProduct(ad));

        /* fire impressions */
        plaAds.forEach((ad) =>
          this.kevel.trackImpression(ad.impressionUrl)
        );

        /* de-dup on Product ID and prepend the ads */
        this.mergeAds(plaProducts);
      })
    );

    console.log(JSON.stringify(this.plas));
  }
  /** turns the creative’s `contents[0].data.*` into the shape your cards need */
  private adAsProduct(ad: any): Product {
    const d = ad.contents[0].data;
    console.log(d);
    return {
      'Product ID'          : Number(d.ctsku) || ad.adId,
      'Brand ID'            : Number(d.ctbrand_id),
      Categories            : (d.ctcategories ?? []).map(Number),
      'Sale_Price'          : Number(d.ctprice),
      'Main Category ID'    : Number(d.ctmain_category_id),
      Price                 : Number(d.ctprice),
      'Brand name'          : d.ctbrand_name,
      'Name of product'     : d.cttitle,
      Star_Rating           : Number(d.ctstar_rating),
      'Product image'       : d.ctimage,
      'Main Category Name'  : d.ctmain_category_name,
      isAd                  : true,              // 👈 so your card shows the pill
    } as Product;
  }

/** put ad-products at the top, REPLACING any organic item with the same id */
private mergeAds(ads: Product[]) {
  /* quick lookup:  Product ID → ad-product */
  const adMap = new Map<number, Product>();
  ads.forEach((ad) => adMap.set(ad['Product ID'], ad));

  /* ── rebuild the master catalogue ───────────────────────────────
     - first the ads (in the order they came from Kevel)
     - then every catalogue item whose id is NOT in the adMap       */
  this.allProducts = [
    ...ads,
    ...this.allProducts.filter((p) => !adMap.has(p['Product ID'])),
  ];

  /* ── rebuild the currently displayed list similarly ───────────── */
  const nonAdsCurrentlyShown = this.filteredProducts.filter(
    (p) => !adMap.has(p['Product ID'])
  );
  this.filteredProducts = [...ads, ...nonAdsCurrentlyShown];
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
    for (let i = 0; i < 3; i++) {
      this.filteredProducts[i] = {
        ...this.filteredProducts[i],
        isAd: true
      };
    }
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

  private buildBrandStrip(brand: string): void {
    const matches = this.allProducts.filter(p => {
      const brandMatch = (p['Brand name'] ?? '').toLowerCase() === brand.toLowerCase();
      const categoryMatch = (p['Main Category Name'] ?? '').toLowerCase() === 'nuts';
      return brandMatch && categoryMatch;
    });
    

    console.log(matches)

    if (matches.length < 3) {           // not enough products – skip
      console.warn(`[Brand Strip] found only ${matches.length} “${brand}” items – strip not rendered`);
      return;
    }

    /* pick first 3 & mark as ads so your “Sponsored” pill shows */
    const stripProducts = matches.slice(0, 3).map(p => ({ ...p, isAd: true }));

    //temp
    const matches2 = this.allProducts.filter(p => {
      const brandMatch = (p['Brand name'] ?? '').toLowerCase() === 'wonderful';
      const categoryMatch = (p['Main Category Name'] ?? '').toLowerCase() === 'nuts';
      return brandMatch && categoryMatch;
    });

    const carousel = matches2.slice(0, 6).map(p => ({ ...p, isAd: true }));

    this.carouselStrip = {
      brandName: "Wonderful Pistachios",
      logoUrl: 'https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/94c505f8-d40f-4f34-90fd-3cd437151857._CR0,0,768,768_AC_SX260_SY120_CB1169409_QL70_.jpg',
      tagLine : `Shop California grown pistachios`,
      headline : `Shop Wonderful`,
      shopUrl  : '#',                   // TODO – real link if you have one
      bannerUrl: 'https://m.media-amazon.com/images/S/al-na-9d5791cf-3faf/c7c2b2ac-6045-4693-a1c6-9119371a346b._CR86,0,1399,732_SX860_CB1169409_QL70_.png', // TODO
      products : carousel
    };

    this.wonderfulStrip = {
      brandName: brand,
      logoUrl: 'images/bigcash.png',
      tagLine : `Shop California grown nuts`,
      headline : `Shop ${brand} `,
      shopUrl  : '#',                   // TODO – real link if you have one
      bannerUrl: 'images/bigcash2.png', //'https://s.zkcdn.net/Advertisers/403caffbc1024dab9c7bafff7af56afd.png', // TODO
      products : stripProducts
    }

  }
  
}
