import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CATEGORIES, Formula, Product } from '../models';
import { CatalogService } from '../services/catalog.service';
import { ProductCard } from './product-card/product-card';
import { NotePanel } from './note-panel/note-panel';
import { NoteService } from '../services/note.service';
import { EurosPipe } from '../shared/euro.pipe';
import { FormulaPicker } from './formula-picker/formula-picker';
import { DailyTotals } from './daily-totals/daily-totals';
import { OrderService } from '../services/order.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { DailyTotal } from '../models';

@Component({
  imports: [ProductCard, NotePanel, EurosPipe, FormulaPicker, DailyTotals],
  selector: 'app-caisse-page',
  styleUrl: './caisse-page.css',
  templateUrl: './caisse-page.html',
})
export class CaissePage implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly note = inject(NoteService);
  private readonly orders = inject(OrderService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly dailyTotals = signal<DailyTotal[]>([]);
  readonly today = new Date().toLocaleDateString('sv-SE');
  readonly todayTotal = computed(() => this.dailyTotals().find((t) => t.day === this.today)?.total ?? 0);
  readonly products = signal<Product[]>([]);
  readonly formulas = signal<Formula[]>([]);
  readonly categories = CATEGORIES;
  readonly openedFormula = signal<Formula | null>(null);
  

  /** Produits dont le stock tient compte de la note en cours. */
  readonly availableProducts = computed(() =>
    this.products().map((p) => ({ ...p, stock: p.stock - (this.note.quantitiesInNote().get(p.id) ?? 0) })),
  );

  ngOnInit(): void {
    this.reload();
    this.catalog.getFormulas().subscribe((formulas) => this.formulas.set(formulas));
  }

  reload() {
    this.catalog.getProducts().subscribe((products) => this.products.set(products));
    this.orders.getDailyTotals().subscribe((totals) => this.dailyTotals.set(totals));
  }

  isFormulaAvailable(formula: Formula): boolean {
    const available = this.availableProducts();
    return [formula.mainCategory, 'BOISSON', 'DESSERT'].every((cat) =>
      available.some((p) => p.category === cat && p.stock > 0),
    );
  }

  onSelect(product: Product) {
    this.note.addProduct(product);
  }

  availableStock(product: Product): number {
    const inNote = this.note.quantitiesInNote().get(product.id) ?? 0;
    return product.stock - inNote
  }

  onFormulaClick(formula: Formula) {
    this.openedFormula.set(formula);
  }

  onFormulaConfirm(choice: { main: Product; drink: Product; dessert: Product }) {
    const formula = this.openedFormula();
    if (!formula) return;
    this.note.addFormula(formula, choice.main, choice.drink, choice.dessert);
    this.openedFormula.set(null);
  }

  onFormulaCancel() {
    this.openedFormula.set(null)
  }

  logout() {
    const done = () => {
      this.note.clear();
      this.router.navigate(['/login']);
    };
    this.auth.logout().subscribe({ next: done, error: done });
  }
}
