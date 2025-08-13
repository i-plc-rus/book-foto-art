import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IAuth } from '../../../core/interfaces/auth.model';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
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
      return;
    }

    const payload: IAuth = { email, username, password };

    this.authService.register(payload).subscribe({
      next: async () => {
        await this.router.navigate(['/client-gallery']);
      },
      error: (err) => {
        // Всегда разблокируем форму при ошибке
        this.isSubmitting = false;
        this.form.enable();

        // Конфликт уникальности (email/username)
        if (err?.status === 409) {
          // Ожидаем от бэка код причины в теле (пример)
          const reason: string | undefined = err?.error?.code ?? err?.error?.reason;

          if (reason === 'EMAIL_TAKEN') {
            this.emailCtrl.setErrors({ conflict: true });
            this.step = 1; // предложить изменить email
          } else if (reason === 'USERNAME_TAKEN') {
            this.usernameCtrl.setErrors({ conflict: true });
            this.step = 2;
          } else {
            // неизвестный конфликт
            this.form.setErrors({ conflict: true });
          }
          return;
        }

        // Валидационные ошибки бэкенда (часто 422)
        if (err?.status === 422 && Array.isArray(err?.error?.errors)) {
          for (const e of err.error.errors) {
            // e = { field: 'email' | 'username' | 'password', message: string }
            const ctrl = this.form.get(e.field);
            if (ctrl) ctrl.setErrors({ server: true, message: e.message });
          }
          return;
        }

        // Прочие ошибки — покажем общий текст
        this.form.setErrors({ server: true });
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
