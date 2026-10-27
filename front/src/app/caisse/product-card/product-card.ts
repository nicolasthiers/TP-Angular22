import { Component, computed, input, output } from "@angular/core";
import { CATEGORIES, Product } from "../../models";
import { EurosPipe } from "../../shared/euro.pipe";

@Component({
    selector: 'app-product-card',
    imports: [EurosPipe],
    templateUrl: './product-card.html',
    styleUrl: './product-card.css',
})
export class ProductCard {
    readonly product = input.required<Product>();
    readonly stock = input.required<number>();

    readonly select = output<Product>();

    readonly icon = computed(() => CATEGORIES.find(c => c.code === this.product().category)?.icon ?? '');

    onClick() {
        if (this.stock() > 0) {
            this.select.emit(this.product());
        }
    }

}
