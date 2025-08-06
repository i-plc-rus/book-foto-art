import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { RouterModule, Router } from '@angular/router';
import { catchError, tap, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [ReactiveFormsModule, RouterModule, NgIf, FormsModule],
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);


  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      console.warn('Form is invalid!');
      this.form.markAllAsTouched();
      return;
    }

    this.errorMsg = '';
    this.loading = true;

    const { email, password } = this.form.value;

    this.authService.login({ email, password }).pipe(
      tap(() => {
        this.router.navigate(['/client-gallery']);
      }),
      catchError(err => {
        this.errorMsg = 'Ошибка входа. Проверьте email и пароль.';
        console.error('Login error:', err);
        return throwError(() => err);
      }),
      finalize(() => this.loading = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }
}
