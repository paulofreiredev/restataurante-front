import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminHeader } from '../shared/admin-header';
import { Order, OrderService } from '../../services/order.service';

interface KanbanColumn {
  status: 'placed' | 'preparing' | 'on_the_way';
  label: string;
  icon: string;
  color: string;
  nextLabel: string | null;
  nextIcon: string | null;
}

@Component({
  selector: 'app-admin-orders',
  imports: [AdminHeader, CurrencyPipe, DatePipe, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class AdminOrders {
  private orderService = inject(OrderService);
  readonly orders = this.orderService.orders;

  readonly columns: KanbanColumn[] = [
    { status: 'placed',     label: 'Pedido feito',    icon: 'receipt_long',    color: 'col-orange', nextLabel: 'Iniciar preparo',  nextIcon: 'soup_kitchen'    },
    { status: 'preparing',  label: 'Em preparo',       icon: 'soup_kitchen',    color: 'col-blue',   nextLabel: 'Saiu pra entrega', nextIcon: 'delivery_dining' },
    { status: 'on_the_way', label: 'Saiu pra entrega', icon: 'delivery_dining', color: 'col-green',  nextLabel: null,               nextIcon: null              },
  ];

  readonly byStatus = computed(() => {
    const all = this.orders();
    return {
      placed:     all.filter(o => o.status === 'placed'),
      preparing:  all.filter(o => o.status === 'preparing'),
      on_the_way: all.filter(o => o.status === 'on_the_way'),
    };
  });

  readonly totalOrders   = computed(() => this.orders().length);
  readonly pendingOrders = computed(() => this.orders().filter(o => o.status !== 'on_the_way').length);

  advance(order: Order) {
    this.orderService.advanceStatus(order.id);
  }

  itemsSummary(order: Order): string {
    const first = order.items.slice(0, 2).map(i => `${i.name} x${i.quantity}`).join(', ');
    const extra = order.items.length > 2 ? ` +${order.items.length - 2}` : '';
    return first + extra;
  }

  paymentLabel(method: string): string {
    return { pix: 'PIX', card: 'Cartão', cash: 'Dinheiro' }[method] ?? method;
  }
}
