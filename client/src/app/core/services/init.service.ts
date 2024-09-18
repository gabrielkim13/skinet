import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  constructor(private readonly cartService: CartService) {}

  init() {
    const cartId = localStorage.getItem('cart_id');
    const cart$ = cartId ? this.cartService.getCart(cartId) : of(null);

    return cart$;
  }
}
