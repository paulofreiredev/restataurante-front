import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  imports: [
    Header,
    Footer,
    ReactiveFormsModule,
    CurrencyPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatRadioModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private cart         = inject(CartService);
  private orderService = inject(OrderService);
  private fb           = inject(FormBuilder);
  private router       = inject(Router);

  readonly items   = this.cart.items;
  readonly total   = this.cart.total;
  readonly isEmpty = computed(() => this.items().length === 0);

  readonly paymentMethods = [
    { value: 'pix',    label: 'PIX',    icon: 'qr_code_2' },
    { value: 'card',   label: 'Cartão', icon: 'credit_card' },
    { value: 'cash',   label: 'Dinheiro', icon: 'payments' },
  ];

  form = this.fb.group({
    street:      ['', [Validators.required]],
    number:      ['', [Validators.required]],
    complement:  [''],
    neighborhood:['', [Validators.required]],
    city:        ['', [Validators.required]],
    payment:     ['', [Validators.required]],
  });

  goBack() {
    this.router.navigate(['/client/home']);
  }

  placeOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const f = this.form.value;
    this.orderService.place({
      items:   this.items(),
      total:   this.total(),
      address: {
        street:       f.street!,
        number:       f.number!,
        complement:   f.complement ?? '',
        neighborhood: f.neighborhood!,
        city:         f.city!,
      },
      paymentMethod: f.payment!,
    });
    this.router.navigate(['/client/order-status']);
  }
}
