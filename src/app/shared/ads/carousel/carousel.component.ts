import { Component, ElementRef, Input, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { Product } from '../../../models/product.model';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface CarouselData {
  brandName: string;
  tagLine: string;
  logoUrl: string;             
  headline: string;               
  shopUrl: string;                
  bannerUrl: string;              
  products: Product[];            
}

@Component({
  selector: 'app-carousel',
  imports: [CommonModule, ProductCardComponent, MatTooltipModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})

export class CarouselComponent {
  @Input({ required: true }) data!: CarouselData;
  
  /** how many cards are fully visible ( matches FoodTrove carousel = 4 ) */
  readonly cardOnly  = 178;    // real card width
  readonly gap       = 30;     // 1.9 rem you use in CSS
  readonly visible   = 5;      // how many cards you want to see
  
  readonly cardWidth = this.cardOnly + this.gap;               // 198
  readonly viewport  = this.cardOnly * this.visible
                     + this.gap * (this.visible - 1); 

  private _index = signal(0);
  index = this._index.asReadonly();


   /* ---------------- DOM handle --------------- */
   @ViewChild('track', { static: true })
   private trackEl!: ElementRef<HTMLElement>;
   
  maxIndex = computed(() =>
    Math.max(0, this.data.products.length - this.visible)
  );

  //  /** slice the original array so the template only sees what’s visible */
  //  visibleProducts = computed(() =>
  //   this.data.products.slice(this._index(), this._index() + this.visibleCount)
  // );

  next() {
    if (this._index() < this.maxIndex()) {
      this._index.update(i => i + 1);
      this.scrollBy(this.cardWidth);
    }
  }

  prev() {
    if (this._index() > 0) {
      this._index.update(i => i - 1);
      this.scrollBy(-this.cardWidth);
    }
  }

    /* helpers for the [disabled] bindings */
    isAtStart() { return this._index() === 0; }
    isAtEnd()   { return this._index() >= this.maxIndex(); }
  
    /* ---------------- core: smooth scroll ------ */
    private scrollBy(px: number) {
      this.trackEl.nativeElement.style.scrollBehavior = 'smooth'; // Fallback for Safari
      this.trackEl.nativeElement.scrollBy({ left: px, behavior: 'smooth' });
    }
}
