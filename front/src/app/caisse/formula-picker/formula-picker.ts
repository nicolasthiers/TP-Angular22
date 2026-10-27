import { Component, computed, input, output, signal } from "@angular/core";
import { Formula, Product } from "../../models";
import { EurosPipe } from "../../shared/euro.pipe";

@Component({
    selector: 'app-formula-picker',
    imports: [EurosPipe],
    templateUrl: './formula-picker.html',
    styleUrl: './formula-picker.css',
  })
  export class FormulaPicker {
    
    readonly formula = input.required<Formula>();
    readonly products = input.required<Product[]>();

    readonly confirm = output<{ main: Product; drink: Product; dessert: Product }>();
    readonly cancel = output<void>();

    readonly selectedMain = signal<Product | null>(null);
    readonly selectedDrink = signal<Product | null>(null);
    readonly selectedDessert = signal<Product | null>(null);

    readonly mains = computed(() => {
      return this.products().filter(p => p.category === this.formula().mainCategory)
    });

    readonly drinks = computed(() => {
      return this.products().filter(p => p.category === 'BOISSON')
    });

    readonly desserts = computed(() => {
      return this.products().filter(p => p.category === 'DESSERT')
    })

    selectMain(product: Product) {
      this.selectedMain.set(product);
    }
    
    selectDrink(product: Product) {
      this.selectedDrink.set(product);
    }
    
    selectDessert(product: Product) {
      this.selectedDessert.set(product);
    }

    readonly canConfirm = computed(() => 
      this.selectedMain() !== null && this.selectedDrink() !== null && this.selectedDessert() !== null,
    );

    onConfirm() {
      if (!this.canConfirm()) return;
      this.confirm.emit({
        main: this.selectedMain()!,
        drink: this.selectedDrink()!,
        dessert: this.selectedDessert()!,
      });
    }

    onCancel() {
      this.cancel.emit();
    }
  }