import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-food-card',
  imports: [MatCardModule, MatButtonModule, MatBadgeModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './food-card.html',
  styleUrl: './food-card.css',
})
export class FoodCard {
  id    = input<number>(1);
  name  = input<string>('Shiba Inu');
  description = input<string>('The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog from Japan.');
  price    = input<number>(29.90);
  imageUrl = input<string>('https://material.angular.dev/assets/img/examples/shiba2.jpg');

  private cart = inject(CartService);

  quantity = computed(() => this.cart.getQuantity(this.id()));

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
