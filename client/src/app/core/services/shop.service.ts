import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  private static readonly BASE_URL = 'https://localhost:5001/api';

  brands: string[] = [];
  types: string[] = [];

  constructor(private readonly http: HttpClient) {}

  getProducts({
    brands,
    types,
    sort,
    pageNumber,
    pageSize,
    search,
  }: ShopParams) {
    let params = new HttpParams();

    if (brands && brands.length > 0) {
      params = params.set('brands', brands.join(','));
    }

    if (types && types.length > 0) {
      params = params.set('types', types.join(','));
    }

    if (sort) {
      params = params.set('sort', sort);
    }

    params = params.set('pageIndex', pageNumber);
    params = params.set('pageSize', pageSize);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Pagination<Product>>(
      `${ShopService.BASE_URL}/products`,
      { params }
    );
  }

  getBrands() {
    if (this.brands.length > 0) {
      return;
    }

    return this.http
      .get<string[]>(`${ShopService.BASE_URL}/products/brands`)
      .subscribe({
        next: (response) => {
          this.brands = response;
        },
      });
  }

  getTypes() {
    if (this.types.length > 0) {
      return;
    }

    return this.http
      .get<string[]>(`${ShopService.BASE_URL}/products/types`)
      .subscribe({
        next: (response) => {
          this.types = response;
        },
      });
  }
}
