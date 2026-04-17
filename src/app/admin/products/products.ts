import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminAuthService } from '../../services/admin-auth.service';
import { Product, ProductService } from '../../services/product.service';

type StatusFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-admin-products',
  imports: [
    ReactiveFormsModule, DecimalPipe,
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatIconModule, MatSlideToggleModule,
    MatButtonToggleModule, MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class AdminProducts {
  private productService = inject(ProductService);
  private auth           = inject(AdminAuthService);
  private fb             = inject(FormBuilder);
  private router         = inject(Router);
  private snack          = inject(MatSnackBar);

  readonly products    = this.productService.products;
  readonly categories  = this.productService.categories;

  searchQuery    = signal('');
  categoryFilter = signal('');
  statusFilter   = signal<StatusFilter>('all');
  panelOpen      = signal(false);
  editingProduct = signal<Product | null>(null);
  confirmDeleteId = signal<number | null>(null);

  readonly allCategories = ['Entradas', 'Sushi Rolls', 'Temaki', 'Combinados', 'Ramen', 'Pratos Quentes', 'Sobremesas'];

  readonly filteredProducts = computed(() => {
    const q   = this.searchQuery().toLowerCase();
    const cat = this.categoryFilter();
    const st  = this.statusFilter();
    return this.products().filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      const matchCat    = !cat || p.category === cat;
      const matchStatus = st === 'all' || (st === 'active' ? p.active : !p.active);
      return matchSearch && matchCat && matchStatus;
    });
  });

  readonly totalProducts  = computed(() => this.products().length);
  readonly activeCount    = computed(() => this.products().filter(p => p.active).length);
  readonly inactiveCount  = computed(() => this.products().filter(p => !p.active).length);
  readonly categoriesCount = computed(() => this.categories().length);

  productForm = this.fb.group({
    name:        ['', Validators.required],
    description: ['', Validators.required],
    price:       [0, [Validators.required, Validators.min(0.01)]],
    category:    ['', Validators.required],
    imageUrl:    [''],
    active:      [true],
  });

  readonly imagePreview = computed(() => this.productForm.get('imageUrl')?.value || '');

  openAddPanel() {
    this.editingProduct.set(null);
    this.productForm.reset({ active: true, price: 0 });
    this.panelOpen.set(true);
  }

  openEditPanel(p: Product) {
    this.editingProduct.set(p);
    this.productForm.setValue({ name: p.name, description: p.description, price: p.price, category: p.category, imageUrl: p.imageUrl, active: p.active });
    this.panelOpen.set(true);
  }

  closePanel() { this.panelOpen.set(false); }

  saveProduct() {
    if (this.productForm.invalid) { this.productForm.markAllAsTouched(); return; }
    const v = this.productForm.value as Omit<Product, 'id'>;
    const editing = this.editingProduct();
    if (editing) {
      this.productService.update(editing.id, v);
      this.snack.open('✅ Prato atualizado!', '', { duration: 2500 });
    } else {
      this.productService.add(v);
      this.snack.open('✅ Prato cadastrado!', '', { duration: 2500 });
    }
    this.closePanel();
  }

  toggleActive(id: number) { this.productService.toggleActive(id); }

  requestDelete(id: number) { this.confirmDeleteId.set(id); }
  cancelDelete()            { this.confirmDeleteId.set(null); }
  confirmDelete(id: number) {
    this.productService.remove(id);
    this.confirmDeleteId.set(null);
    this.snack.open('🗑️ Prato removido.', '', { duration: 2500 });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
