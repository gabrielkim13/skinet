import { Component, OnInit } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { ShopService } from '../../core/services/shop.service';

import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';

import { ProductItemComponent } from './product-item/product-item.component';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatIcon,
    MatList,
    MatListOption,
    MatMenu,
    MatMenuTrigger,
    MatPaginator,
    MatSelectionList,
    ProductItemComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  private static readonly SORT_OPTIONS = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-High', value: 'priceAsc' },
    { name: 'Price: High-Low', value: 'priceDesc' },
  ];

  private static readonly PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

  baseUrl = 'https://localhost:5001/api/';

  products?: Pagination<Product>;

  shopParams: ShopParams = new ShopParams();

  constructor(
    private readonly dialogService: MatDialog,
    private readonly shopService: ShopService
  ) {}

  public get sortOptions() {
    return ShopComponent.SORT_OPTIONS;
  }

  public get pageSizeOptions() {
    return ShopComponent.PAGE_SIZE_OPTIONS;
  }

  ngOnInit(): void {
    this.initializeShop();
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (!result) return;

        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;

          this.shopParams.pageNumber = 1;

          this.getProducts();
        }
      },
    });
  }

  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];

    if (!selectedOption) return;

    this.shopParams.sort = selectedOption.value;

    this.shopParams.pageNumber = 1;

    this.getProducts();
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;

    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;

    this.getProducts();
  }

  private initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();

    this.getProducts();
  }

  private getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
