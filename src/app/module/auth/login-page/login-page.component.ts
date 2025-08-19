import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { AuthService } from '../../../core/service/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/message';

@Component({
  standalone: true,
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  imports: [ReactiveFormsModule, RouterModule, FormsModule, Checkbox, InputText, Toast, Message],
  providers: [MessageService],
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);

  form: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    remember: new FormControl(false, { nonNullable: true }),
  });
  loading = false;
  loginError: string = '';
  showLoginError = false;

  get emailCtrl(): FormControl<string> {
    return this.form.controls.email;
  }
  get passwordCtrl(): FormControl<string> {
    return this.form.controls.password;
  }

  isEmailTouched(): boolean {
    return this.emailCtrl.touched;
  }
  hasEmailRequired(): boolean {
    return this.emailCtrl.hasError('required');
  }
  hasEmailFormatError(): boolean {
    return this.emailCtrl.hasError('email');
  }

  isPasswordTouched(): boolean {
    return this.passwordCtrl.touched;
  }
  hasPasswordRequired(): boolean {
    return this.passwordCtrl.hasError('required');
  }

  onSubmit(): void {
    const { email, password } = this.form.value;
    if (this.form.invalid || !email || !password) {
      console.warn('Form is invalid!');
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.showLoginError = false;
    this.loginError = '';

    this.authService
      .login({ email, password })
      .pipe(
        tap(() => {
          this.showLoginError = false;
          this.loginError = '';
          this.router.navigate(['/client-gallery']);
        }),
        catchError((err) => {
          const detail =
            err?.status === 401
              ? 'Неправильная пара email-пароль'
              : 'Произошла ошибка, попробуйте ещё раз';

          this.loginError = detail;
          this.showLoginError = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Ошибка входа',
            detail,
            life: 4000,
          });
          console.error('Login error:', err);
          return throwError(() => err);
        }),
        finalize(() => (this.loading = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
