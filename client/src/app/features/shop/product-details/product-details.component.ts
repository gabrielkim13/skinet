import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { CartService } from '../../../core/services/cart.service';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    MatButton,
    MatDivider,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;

  quantityInCart = 0;
  quantity = 1;

  constructor(
    private readonly cartService: CartService,
    private readonly shopService: ShopService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  getButtonText() {
    return this.quantityInCart > 0 ? 'Update Cart' : 'Add to Cart';
  }

  updateCart() {
    if (!this.product) return;

    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;

      this.quantityInCart += itemsToAdd;

      this.cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;

      this.quantityInCart -= itemsToRemove;

      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  private loadProduct() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (!id) return;

    this.shopService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;

        this.updateQuantityInCart();
      },
      error: (error) => console.error(error),
    });
  }

  private updateQuantityInCart() {
    this.quantityInCart =
      this.cartService
        .cart()
        ?.items.find((i) => i.productId === this.product?.id)?.quantity ?? 0;

    this.quantity = this.quantityInCart || 1;
  }
}
