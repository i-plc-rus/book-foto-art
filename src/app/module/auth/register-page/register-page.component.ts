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
        console.error('Ошибка при регистрации:', err);
        alert('Регистрация не удалась');
        this.isSubmitting = false;
      },
    });
  }

  get emailCtrl(): FormControl<string | null> {
    return this.form.get('email') as FormControl<string | null>;
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
}
