import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_URL } from '../api';
import { Observable } from 'rxjs';
import { Product, Formula } from '../models';

@Service()
export class CatalogService {

private readonly http = inject(HttpClient);

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${API_URL}/products`);
    }

    getFormulas(): Observable<Formula[]> {
        return this.http.get<Formula[]>(`${API_URL}/formulas`);
    }
}
