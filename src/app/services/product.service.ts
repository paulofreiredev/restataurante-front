import { Injectable, signal, computed } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  active: boolean;
}

const JAPANESE_MENU: Product[] = [
  { id: 1, name: 'Salmão Grelhado', description: 'Filé de salmão grelhado na manteiga de ervas, acompanhado de arroz gohan e missoshiru.', price: 52.90, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80', category: 'Pratos Quentes', active: true },
  { id: 2, name: 'Temaki de Atum', description: 'Cone de nori recheado com atum fresco, cream cheese e pepino japonês.', price: 28.90, imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', category: 'Temaki', active: true },
  { id: 3, name: 'Ramen Tonkotsu', description: 'Caldo cremoso de ossos de porco, macarrão ramen, chashu, ovo mollet e nori.', price: 46.90, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', category: 'Ramen', active: true },
  { id: 4, name: 'Combinado Especial 16 peças', description: 'Seleção do chef com 8 nigiri variados e 8 uramaki de salmão com cream cheese.', price: 79.90, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80', category: 'Combinados', active: true },
  { id: 5, name: 'Gyoza (6 unidades)', description: 'Pastel japonês recheado com porco e repolho, grelhado e servido com molho ponzu.', price: 24.90, imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', category: 'Entradas', active: true },
  { id: 6, name: 'Uramaki Philadelphia', description: '8 peças de uramaki com salmão, cream cheese e pepino, finalizado com gergelim.', price: 34.90, imageUrl: 'https://images.unsplash.com/photo-1617196034554-e8895e3f71d8?w=400&q=80', category: 'Sushi Rolls', active: true },
  { id: 7, name: 'Edamame', description: 'Vagem de soja cozida no vapor com flor de sal. Entrada leve e clássica.', price: 14.90, imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&q=80', category: 'Entradas', active: true },
  { id: 8, name: 'Katsu Curry', description: 'Costeleta de frango empanada sobre arroz japonês com curry caseiro e fukujinzuke.', price: 49.90, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80', category: 'Pratos Quentes', active: true },
  { id: 9, name: 'Mochi de Morango', description: 'Bolinho de arroz glutinoso recheado com pasta de morango e creme de leite.', price: 12.90, imageUrl: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=400&q=80', category: 'Sobremesas', active: true },
  { id: 10, name: 'Yakisoba de Frango', description: 'Macarrão soba refogado com frango, legumes da estação e molho shoyu especial.', price: 38.90, imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80', category: 'Pratos Quentes', active: false },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _products = signal<Product[]>(JAPANESE_MENU);

  readonly products       = this._products.asReadonly();
  readonly activeProducts = computed(() => this._products().filter(p => p.active));
  readonly categories     = computed(() => [...new Set(this._products().map(p => p.category))]);

  add(data: Omit<Product, 'id'>): void {
    const nextId = Math.max(0, ...this._products().map(p => p.id)) + 1;
    this._products.update(list => [...list, { ...data, id: nextId }]);
  }

  update(id: number, changes: Partial<Omit<Product, 'id'>>): void {
    this._products.update(list => list.map(p => p.id === id ? { ...p, ...changes } : p));
  }

  remove(id: number): void {
    this._products.update(list => list.filter(p => p.id !== id));
  }

  toggleActive(id: number): void {
    this._products.update(list => list.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  getById(id: number): Product | undefined {
    return this._products().find(p => p.id === id);
  }
}
