import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminHeader } from '../shared/admin-header';
import { ConfirmDialog } from '../shared/confirm-dialog';
import { Order, OrderService, OrderStatus } from '../../services/order.service';

interface KanbanColumn {
  status: OrderStatus;
  label: string;
  icon: string;
  colorClass: string;
  nextLabel: string | null;
  nextIcon: string | null;
}

@Component({
  selector: 'app-admin-orders',
  imports: [AdminHeader, CurrencyPipe, DatePipe, MatButtonModule, MatIconModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class AdminOrders {
  private orderService = inject(OrderService);
  private dialog       = inject(MatDialog);

  readonly orders = this.orderService.orders;

  readonly columns: KanbanColumn[] = [
    { status: 'placed',     label: 'Pedido feito',    icon: 'receipt_long',    colorClass: 'col-orange', nextLabel: 'Iniciar preparo',  nextIcon: 'soup_kitchen'    },
    { status: 'preparing',  label: 'Em preparo',       icon: 'soup_kitchen',    colorClass: 'col-blue',   nextLabel: 'Saiu pra entrega', nextIcon: 'delivery_dining' },
    { status: 'on_the_way', label: 'Saiu pra entrega', icon: 'delivery_dining', colorClass: 'col-purple', nextLabel: 'Entregue',         nextIcon: 'check_circle'    },
    { status: 'delivered',  label: 'Entregue',         icon: 'check_circle',    colorClass: 'col-green',  nextLabel: null,               nextIcon: null              },
  ];

  readonly byStatus = computed(() => {
    const all = this.orders();
    const group = (s: OrderStatus) => all.filter(o => o.status === s);
    return {
      placed:     group('placed'),
      preparing:  group('preparing'),
      on_the_way: group('on_the_way'),
      delivered:  group('delivered'),
      cancelled:  group('cancelled'),
    };
  });

  readonly totalOrders    = computed(() => this.orders().length);
  readonly activeOrders   = computed(() => this.orders().filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length);
  readonly cancelledCount = computed(() => this.byStatus().cancelled.length);

  /** Avança o status com confirmação */
  confirmAdvance(order: Order, col: KanbanColumn) {
    const nextLabel = col.nextLabel!;
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: `Mover para "${nextLabel}"?`,
        message: `O pedido ${order.id} será movido para a etapa "${nextLabel}". Deseja confirmar?`,
        confirmLabel: nextLabel,
        confirmColor: 'primary',
        icon: col.nextIcon ?? 'arrow_forward',
      },
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.orderService.advanceStatus(order.id);
    });
  }

  /** Cancela o pedido com confirmação */
  confirmCancel(order: Order) {
    const ref = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Cancelar pedido?',
        message: `O pedido ${order.id} será cancelado e não poderá ser revertido. Deseja continuar?`,
        confirmLabel: 'Cancelar pedido',
        confirmColor: 'warn',
        icon: 'cancel',
      },
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.orderService.cancelOrder(order.id);
    });
  }

  canCancel(o: Order) { return this.orderService.canCancel(o.status); }

  itemsSummary(order: Order): string {
    const first = order.items.slice(0, 2).map(i => `${i.name} x${i.quantity}`).join(', ');
    const extra = order.items.length > 2 ? ` +${order.items.length - 2}` : '';
    return first + extra;
  }

  paymentLabel(method: string): string {
    return ({ pix: 'PIX', card: 'Cartão', cash: 'Dinheiro' } as Record<string, string>)[method] ?? method;
  }
}
