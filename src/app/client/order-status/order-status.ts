import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { OrderService, OrderStatus as OrderStatusType } from '../../services/order.service';

interface TrackStep {
  status: OrderStatusType;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-order-status',
  imports: [
    Header,
    Footer,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-status.html',
  styleUrl: './order-status.css',
})
export class OrderStatus implements OnInit {
  private orderService = inject(OrderService);
  private router       = inject(Router);

  readonly order = this.orderService.order;

  readonly steps: TrackStep[] = [
    {
      status:      'placed',
      label:       'Pedido feito',
      icon:        'receipt_long',
      description: 'Seu pedido foi recebido pelo restaurante.',
    },
    {
      status:      'preparing',
      label:       'Em preparo',
      icon:        'soup_kitchen',
      description: 'Nossa equipe está preparando seu pedido.',
    },
    {
      status:      'on_the_way',
      label:       'Saiu pra entrega',
      icon:        'delivery_dining',
      description: 'Seu pedido está a caminho!',
    },
  ];

  readonly statusOrder: OrderStatusType[] = ['placed', 'preparing', 'on_the_way'];

  readonly paymentLabels: Record<string, string> = {
    pix:  'PIX',
    card: 'Cartão de crédito/débito',
    cash: 'Dinheiro',
  };

  isCompleted(stepStatus: OrderStatusType): boolean {
    const current = this.order()?.status ?? 'placed';
    return this.statusOrder.indexOf(stepStatus) <= this.statusOrder.indexOf(current);
  }

  ngOnInit() {
    if (!this.order()) {
      this.router.navigate(['/client/home']);
    }
  }

  backToHome() {
    this.router.navigate(['/client/home']);
  }
}
