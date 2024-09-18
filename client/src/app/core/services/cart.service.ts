import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';

import { Cart, CartItem } from '../../shared/models/cart';
import { Product } from '../../shared/models/product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private static readonly BASE_URL = environment.apiUrl;

  cart = signal<Cart | null>(null);

  itemCount = computed(
    () => this.cart()?.items.reduce((acc, i) => acc + i.quantity, 0) ?? 0
  );

  totals = computed(() => {
    const subtotal =
      this.cart()?.items.reduce((acc, i) => acc + i.price * i.quantity, 0) ?? 0;

    const shipping = 0;

    const discount = 0;

    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
    };
  });

  constructor(private readonly http: HttpClient) {}

  getCart(id: string) {
    return this.http.get<Cart>(`${CartService.BASE_URL}/cart?id=${id}`).pipe(
      map((cart) => {
        this.cart.set(cart);
        return cart;
      })
    );
  }

  setCart(cart: Cart) {
    return this.http
      .post<Cart>(`${CartService.BASE_URL}/cart`, cart)
      .subscribe({
        next: (cart) => this.cart.set(cart),
        error: console.error,
      });
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();

    let itemToAdd: CartItem;

    console.log(item);

    if (this.isProduct(item)) {
      itemToAdd = this.mapProductToCartItem(item, quantity);
    } else {
      itemToAdd = item;
    }

    cart.items = this.addOrUpdateItem(cart.items, itemToAdd, quantity);

    this.setCart(cart);
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();

    if (!cart) {
      return;
    }

    const itemIndex = cart.items.findIndex((i) => i.productId === productId);

    if (itemIndex === -1) {
      return;
    }

    const item = cart.items[itemIndex];

    item.quantity -= quantity;

    if (item.quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    }

    if (cart.items.length === 0) {
      this.deleteCart();
    } else {
      this.setCart(cart);
    }
  }

  private createCart(): Cart {
    const cart = new Cart();

    localStorage.setItem('cart_id', cart.id);

    return cart;
  }

  private deleteCart() {
    const id = this.cart()?.id;

    if (!id) {
      return;
    }

    return this.http.delete(`${CartService.BASE_URL}/cart?id=${id}`).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');

        this.cart.set(null);
      },
      error: console.error,
    });
  }

  private isProduct(item: CartItem | Product): item is Product {
    return 'id' in item;
  }

  private mapProductToCartItem(product: Product, quantity: number): CartItem {
    return {
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      type: product.type,
    };
  }

  private addOrUpdateItem(
    items: CartItem[],
    item: CartItem,
    quantity: number
  ): CartItem[] {
    const existingItem = items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push(item);
    }

    return items;
  }
}
