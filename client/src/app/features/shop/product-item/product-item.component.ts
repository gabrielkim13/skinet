import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { CartService } from '../../../core/services/cart.service';

import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatIcon,
    RouterLink,
  ],
  templateUrl: './product-item.component.html',
  styleUrl: './product-item.component.scss',
})
export class ProductItemComponent {
  @Input()
  product?: Product;

  constructor(public readonly cartService: CartService) {}
}
