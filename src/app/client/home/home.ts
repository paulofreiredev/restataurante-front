import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../header/header';
import { Footer } from '../../footer/footer';
import { FoodCard } from '../../food-card/food-card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Footer, FoodCard, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private productService = inject(ProductService);
  readonly products = this.productService.getProducts();
}
