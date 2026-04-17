import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from './cart.service';

export type OrderStatus = 'placed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

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

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000);

const DEMO_ORDERS: Order[] = [
  {
    id: '#DEMO0001',
    items: [
      { id: 3, name: 'Ramen Tonkotsu', description: '', price: 46.90, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', quantity: 1 },
      { id: 5, name: 'Gyoza (6 unidades)', description: '', price: 24.90, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', quantity: 2 },
    ],
    total: 96.70,
    address: { street: 'Rua das Flores', number: '123', complement: 'Apto 4B', neighborhood: 'Centro', city: 'São Paulo' },
    paymentMethod: 'pix',
    status: 'placed',
    placedAt: ago(3),
  },
  {
    id: '#DEMO0002',
    items: [
      { id: 4, name: 'Combinado Especial 16 peças', description: '', price: 79.90, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80', quantity: 1 },
      { id: 7, name: 'Edamame', description: '', price: 14.90, imageUrl: '', quantity: 1 },
    ],
    total: 94.80,
    address: { street: 'Av. Paulista', number: '1000', complement: '', neighborhood: 'Bela Vista', city: 'São Paulo' },
    paymentMethod: 'card',
    status: 'preparing',
    placedAt: ago(18),
  },
  {
    id: '#DEMO0003',
    items: [
      { id: 1, name: 'Salmão Grelhado', description: '', price: 52.90, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80', quantity: 2 },
    ],
    total: 105.80,
    address: { street: 'Rua Augusta', number: '500', complement: 'Casa 2', neighborhood: 'Consolação', city: 'São Paulo' },
    paymentMethod: 'cash',
    status: 'on_the_way',
    placedAt: ago(42),
  },
  {
    id: '#DEMO0004',
    items: [
      { id: 6, name: 'Uramaki Philadelphia', description: '', price: 34.90, imageUrl: 'https://images.unsplash.com/photo-1617196034554-e8895e3f71d8?w=400&q=80', quantity: 1 },
    ],
    total: 34.90,
    address: { street: 'Rua Haddock Lobo', number: '200', complement: '', neighborhood: 'Jardins', city: 'São Paulo' },
    paymentMethod: 'pix',
    status: 'delivered',
    placedAt: ago(90),
  },
  {
    id: '#DEMO0005',
    items: [
      { id: 9, name: 'Mochi de Morango', description: '', price: 12.90, imageUrl: '', quantity: 3 },
    ],
    total: 38.70,
    address: { street: 'Alameda Santos', number: '45', complement: '', neighborhood: 'Jardim Paulista', city: 'São Paulo' },
    paymentMethod: 'cash',
    status: 'cancelled',
    placedAt: ago(25),
  },
];

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  placed:    'preparing',
  preparing: 'on_the_way',
  on_the_way:'delivered',
};

/** Status que ainda podem ser cancelados */
const CANCELLABLE: OrderStatus[] = ['placed', 'preparing', 'on_the_way'];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private _orders = signal<Order[]>(DEMO_ORDERS);

  readonly orders    = this._orders.asReadonly();
  readonly lastOrder = computed(() => this._orders().at(-1) ?? null);

  /** Alias mantido para compatibilidade com order-status page do cliente */
  readonly order = this.lastOrder;

  place(data: Omit<Order, 'id' | 'status' | 'placedAt'>): Order {
    const order: Order = { ...data, id: this.generateId(), status: 'placed', placedAt: new Date() };
    this._orders.update(list => [...list, order]);
    return order;
  }

  advanceStatus(orderId: string): void {
    this._orders.update(list =>
      list.map(o => {
        if (o.id !== orderId) return o;
        const next = STATUS_NEXT[o.status];
        return next ? { ...o, status: next } : o;
      })
    );
  }

  cancelOrder(orderId: string): void {
    this._orders.update(list =>
      list.map(o =>
        o.id === orderId && CANCELLABLE.includes(o.status)
          ? { ...o, status: 'cancelled' }
          : o
      )
    );
  }

  canCancel(status: OrderStatus): boolean {
    return CANCELLABLE.includes(status);
  }

  private generateId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return '#' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}
