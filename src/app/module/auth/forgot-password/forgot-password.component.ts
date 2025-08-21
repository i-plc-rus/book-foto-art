import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ResetPasswordService } from '../services/reset-password.service';
import { InputText } from 'primeng/inputtext';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  imports: [FormsModule, ReactiveFormsModule, InputText],
  providers: [ResetPasswordService],
})
export class ForgotPasswordComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router: Router = inject(Router);
  private readonly resetPasswordService: ResetPasswordService = inject(ResetPasswordService);

  readonly form: FormGroup<{
    email: FormControl<string>;
  }> = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  isLoading: boolean = false;
  success: boolean = false;

  get emailCtrl(): FormControl<string> {
    return this.form.controls.email;
  }

  goHome(): void {
    this.router.navigate(['/']).catch(() => {});
  }

  goToLogin(): void {
    this.router.navigate(['/login']).catch(() => {});
  }

  isEmailTouched(): boolean {
    return this.emailCtrl.touched || this.emailCtrl.dirty;
  }

  hasEmailRequired(): boolean {
    return this.emailCtrl.hasError('required');
  }

  hasEmailFormatError(): boolean {
    return !this.hasEmailRequired() && this.emailCtrl.hasError('email');
  }

  sendEmail(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;

    this.resetPasswordService
      .reset(this.emailCtrl.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.success = true;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
