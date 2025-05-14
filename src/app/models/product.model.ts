// src/app/models/product.model.ts

export interface Product {
    'Product ID': number;
    'Brand ID': number;
    'Categories': number[];
    'Sale_Price': number;
    'Main Category ID': number;
    'Price': number;
    'Brand name': string;
    'Name of product': string;
    'Star_Rating': number;
    'Product image': string;
    'Main Category Name': string;
    isAd?: boolean;
  }
  
  export interface GPAProduct {
    "id": number,
    "stock": boolean,
    "priceType": string,
    "price": number,
    "priceFrom": number,
    "sku": string,
    "brand": string,
    "urlDetails": string,
    "name": string,
    "sellerName": string,
    "storeId": number,
    "sellType": string,
    "fromCDNal": boolean,
    "trackingId": string,
    "variableWeight": boolean,
    "image": string,
    "categories": string[],
    "category_ids": number[]
  }