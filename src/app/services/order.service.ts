import { Injectable, signal } from '@angular/core';
import { CartItem } from './cart.service';

export type OrderStatus = 'placed' | 'preparing' | 'on_the_way';

export interface OrderAddress {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: OrderAddress;
  paymentMethod: string;
  status: OrderStatus;
  placedAt: Date;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private _order = signal<Order | null>(null);
  readonly order = this._order.asReadonly();

  place(data: Omit<Order, 'id' | 'status' | 'placedAt'>): Order {
    const order: Order = {
      ...data,
      id: this.generateId(),
      status: 'placed',
      placedAt: new Date(),
    };
    this._order.set(order);
    return order;
  }

  private generateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const random = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    return `#${random}`;
  }
}
