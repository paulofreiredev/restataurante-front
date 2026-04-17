import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  add(product: Omit<CartItem, 'quantity'>) {
    this._items.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  remove(productId: number) {
    this._items.update(items => {
      const existing = items.find(i => i.id === productId);
      if (!existing || existing.quantity <= 1) {
        return items.filter(i => i.id !== productId);
      }
      return items.map(i =>
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }

  getQuantity(productId: number): number {
    return this._items().find(i => i.id === productId)?.quantity ?? 0;
  }
}
