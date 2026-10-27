import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api';
import { DailyTotal, Order, OrderRequest } from '../models';

@Service()
export class OrderService {
    private readonly http = inject(HttpClient);

    pay(request: OrderRequest): Observable<Order> {
        return this.http.post<Order>(`${API_URL}/orders`, request);
    }

    getDailyTotals(): Observable<DailyTotal[]> {
        return this.http.get<DailyTotal[]>(`${API_URL}/orders/daily-totals`);
    }
}
