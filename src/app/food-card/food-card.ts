import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-food-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './food-card.html',
  styleUrl: './food-card.css',
})
export class FoodCard {
  id          = input<number>(1);
  name        = input<string>('Produto');
  description = input<string>('Sem descrição.');
  price       = input<number>(0);
  imageUrl    = input<string>('');

  private cart = inject(CartService);

  quantity   = computed(() => this.cart.getQuantity(this.id()));
  imageError = signal(false);

  add() {
    this.cart.add({
      id: this.id(),
      name: this.name(),
      description: this.description(),
      price: this.price(),
      imageUrl: this.imageUrl(),
    });
  }

  remove() {
    this.cart.remove(this.id());
  }
}
