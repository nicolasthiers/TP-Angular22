import { Component, inject, output, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { EurosPipe } from "../../shared/euro.pipe";
import { NoteService } from "../../services/note.service";
import { OrderService } from "../../services/order.service";
import { ApiError } from "../../models";

@Component({
    selector: 'app-note-panel',
    imports: [EurosPipe],
    templateUrl: './note-panel.html',
    styleUrl: './note-panel.css',
  })
  export class NotePanel {
    readonly note = inject(NoteService);
    private readonly orders = inject(OrderService);

    /** Émis après une tentative de paiement (réussie ou non) : la page recharge les données. */
    readonly settled = output<void>();

    readonly paying = signal(false);
    readonly success = signal<string | null>(null);
    readonly error = signal<string | null>(null);

    canIncrease(productId: number, stock: number): boolean {
      return stock - (this.note.quantitiesInNote().get(productId) ?? 0) > 0;
    }

    pay() {
      if (this.paying() || this.note.lines().length === 0) return;
      this.paying.set(true);
      this.success.set(null);
      this.error.set(null);
      this.orders.pay(this.note.toOrderRequest()).subscribe({
        next: (order) => {
          this.paying.set(false);
          this.success.set(`Note n°${order.id} payée : ${(order.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`);
          this.note.clear();
          this.settled.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.paying.set(false);
          const body = err.error as ApiError | null;
          this.error.set(body?.message ?? 'Le serveur ne répond pas.');
          this.settled.emit();
        },
      });
    }
  }
