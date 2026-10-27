import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly service = inject(AuthService);
  private readonly router = inject(Router);
  private readonly nnfb = inject(NonNullableFormBuilder);


  form = this.nnfb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { login, password } = this.form.getRawValue();

    this.service.login(login, password).subscribe({
      next: () => { this.router.navigate(['/caisse']) },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 401) {
          this.error.set('Identifiant ou mot de passe incorrect');
        } else {
          this.error.set('Le serveur ne répond pas');
        }
       },
    })
  }
 
}
