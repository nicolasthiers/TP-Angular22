import { computed, Service, signal } from "@angular/core";
import { Formula, OrderRequest, Product } from "../models";

function increment(map: Map<number, number>, productId: number, by: number) {
    map.set(productId, (map.get(productId) ?? 0) + by); 
}

export interface FormulaLine {
    kind: 'formula';
    formula: Formula;
    main: Product;
    drink: Product;
    dessert: Product;
}

export interface ProductLine {
    kind: 'product';
    product: Product;
    quantity: number;
}

export type NoteLine = ProductLine | FormulaLine;

@Service()
export class NoteService {

    private readonly _lines = signal<NoteLine[]>([]);
    readonly lines = this._lines.asReadonly();

    readonly total = computed(() => 
    this.lines().reduce((sum, line) => {
        if (line.kind === 'product') {
            return sum + line.product.price * line.quantity;
        }
        return sum + line.formula.price;
    }, 0),
    );

    readonly quantitiesInNote = computed (() => {
        const map = new Map<number, number>();
        for (const line of this.lines()) {
            if (line.kind === 'product') {
                increment(map, line.product.id, line.quantity);
            } else {
                increment(map, line.main.id, 1);
                increment(map, line.drink.id, 1);
                increment(map, line.dessert.id, 1);
            }
        }
        return map;
    });

    addProduct(product: Product) {
        this._lines.update(lines => {
            const existe = lines.some(line => line.kind === 'product' && line.product.id === product.id);

            if (existe) {
                return lines.map(line => 
                    line.kind === 'product' && line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
                );
            }

            return [...lines, { kind: 'product' as const, product, quantity: 1 }];
        });
        

    }

    removeProduct(productId: number) {
       this._lines.update(lines => lines.filter(line =>  line.kind !== 'product' || line.product.id !== productId));
    }

    removeLine(index: number) {
        this._lines.update(lines => lines.filter((_, i) => i !== index));
    }

    decreaseProduct(productId: number) {
        this._lines.update(lines => 
            lines.map(line => line.kind === 'product' && line.product.id === productId ? { ...line, quantity: line.quantity - 1 } : line,                    
            ).filter(line => line.kind !== 'product' || line.quantity > 0),
        );
    }

    clear() {
        this._lines.set([]);
    }

    addFormula(formula: Formula, main: Product, drink: Product, dessert: Product) {
        this._lines.update(lines => [...lines, { kind: 'formula' as const, formula, main, drink, dessert }]);
    }

    toOrderRequest(): OrderRequest {
        const request: OrderRequest = { products: [], formulas: [] };
        for (const line of this.lines()) {
            if (line.kind === 'product') {
                request.products.push({ productId: line.product.id, quantity: line.quantity });
            } else {
                request.formulas.push({
                    formulaId: line.formula.id,
                    mainId: line.main.id,
                    drinkId: line.drink.id,
                    dessertId: line.dessert.id,
                });
            }
        }
        return request;
    }
}