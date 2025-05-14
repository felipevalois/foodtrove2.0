import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, GPAProduct } from '../../models/product.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  // @Input() product!: GPAProduct;

  ngOnInit() {
    // console.log('ProductCardComponent:', this.product);
  }
  openEditor(adData: any) {
    // console.log('openEditor', adData);
  }
}
