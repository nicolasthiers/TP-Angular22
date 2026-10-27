import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const token = auth.token();


    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}`} }) : req;

    return next(authReq).pipe(
        catchError((err) => {
            if (err.status == 401 && !req.url.endsWith('/login')) {
                auth.clearToken();
                router.navigate(['/login']);
            }
            return throwError(() => err);
        })
    )

}