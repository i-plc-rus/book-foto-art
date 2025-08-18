import { CommonModule } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { FormControl, FormGroup } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { finalize } from 'rxjs';

import { AuthService } from '../../../core/service/auth.service';
import type { IAuthRegister } from '../../../interfaces/auth.interface';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Toast, InputText],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly messageService: MessageService = inject(MessageService);
  form!: FormGroup<{
    email: FormControl<string | null>;
    username: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  step: number = 1;
  isSubmitting: boolean = false;

  ngOnInit(): void {
    this.form = this.fb.group<{
      email: FormControl<string | null>;
      username: FormControl<string | null>;
      password: FormControl<string | null>;
    }>({
      username: this.fb.control<string | null>(null, { validators: [Validators.required] }),
      email: this.fb.control<string | null>(null, {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    });
  }

  nextStep(): void {
    this.emailCtrl.markAsTouched();
    this.emailCtrl.updateValueAndValidity({ onlySelf: true });
    if (!this.canContinueStep1()) {
      return;
    }

    this.step = 2;
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.isSubmitting || this.form.invalid) return;

    this.isSubmitting = true;
    const { email, username, password } = this.form.getRawValue();
    this.form.disable();

    if (!email || !username || !password) {
      this.isSubmitting = false;
      this.form.enable();
      this.messageService.add({
        severity: 'error',
        summary: 'Регистрация',
        detail: 'окээээй',
        life: 5000,
      });
      return;
    }

    const payload: IAuthRegister = { email, username, password };

    this.authService
      .register(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.form.enable();
        }),
      )
      .subscribe({
        next: async (res: any) => {
          // бэк вернул 200 + { error: '...' }
          if (res && typeof res === 'object' && 'error' in res) {
            const msg = String(res.error ?? 'Ошибка');
            this.messageService.add({
              severity: 'error',
              summary: 'Регистрация',
              detail: msg,
              life: 5000,
            });
            return;
          }
          await this.router.navigate(['/client-gallery']);
        },
        error: (err: any) => {
          if (err?.status === 409) {
            const msg = typeof err?.error === 'string' ? err.error : 'Пользователь уже существует';
            this.messageService.add({
              severity: 'error',
              summary: 'Регистрация',
              detail: msg,
              life: 5000,
            });
            return;
          }

          if (err?.status === 422 && Array.isArray(err?.error?.errors)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Регистрация',
              detail: 'Исправьте ошибки в форме',
              life: 5000,
            });
            return;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Регистрация',
            detail: 'Что-то пошло не так',
            life: 5000,
          });
        },
      });
  }

  get emailCtrl(): FormControl<string | null> {
    return this.form.get('email') as FormControl<string | null>;
  }

  get usernameCtrl(): FormControl<string | null> {
    return this.form.get('username') as FormControl<string | null>;
  }
  get passwordCtrl(): FormControl<string | null> {
    return this.form.get('password') as FormControl<string | null>;
  }

  isEmailTouched(): boolean {
    const emailCtrl = this.emailCtrl;
    return !!emailCtrl && (emailCtrl.touched || emailCtrl.dirty);
  }

  hasEmailFormatError(): boolean {
    if (!this.emailCtrl) {
      return false;
    }
    return this.emailCtrl.hasError('email');
  }

  hasEmailRequired(): boolean {
    if (!this.emailCtrl) {
      return false;
    }
    return this.emailCtrl?.hasError('required');
  }

  canContinueStep1(): boolean {
    return this.emailCtrl?.valid ?? false;
  }

  isUsernameTouched(): boolean {
    const usernameCtrl = this.usernameCtrl;
    return !!usernameCtrl && (usernameCtrl.touched || usernameCtrl.dirty);
  }
  hasUsernameRequired(): boolean {
    const usernameCtrl = this.usernameCtrl;
    return !!usernameCtrl && usernameCtrl.hasError('required');
  }

  isPasswordTouched(): boolean {
    const passwordCtrl = this.passwordCtrl;
    return !!passwordCtrl && (passwordCtrl.touched || passwordCtrl.dirty);
  }
  hasPasswordRequired(): boolean {
    const passwordCtrl = this.passwordCtrl;
    return !!passwordCtrl && passwordCtrl.hasError('required');
  }
  hasPasswordLengthErr(): boolean {
    const passwordCtrl = this.passwordCtrl;
    return (
      !!passwordCtrl && !passwordCtrl.hasError('required') && passwordCtrl.hasError('minlength')
    );
  }
}
