import { HttpClient } from '@angular/common/http';
import { computed, Service, inject, signal } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { API_URL } from '../api';
import { LoginResponse } from '../models';



@Service()
export class AuthService {

    private readonly http = inject(HttpClient);

    readonly token = signal<string | null>(sessionStorage.getItem('token'));

    isLoggedIn = computed(() => !!this.token());

    login(login: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { login, password }).pipe(
            tap(res => {
                this.token.set(res.token);
                sessionStorage.setItem('token', res.token);
            })
        );
    }

    logout(): Observable<unknown> {
        return this.http.post(`${API_URL}/auth/logout`, {}).pipe(
            finalize(() => {
                this.clearToken();
            })
        )
    }

    clearToken() {
        this.token.set(null);
        sessionStorage.removeItem('token');
    }

}