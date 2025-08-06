import {Component, DestroyRef, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {ResetPasswordService} from '../services/reset-password.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule
  ],
  providers: [ResetPasswordService]
})
export class ForgotPasswordComponent {

  emailControl = new FormControl('', [Validators.required, Validators.email]);
  inputValue = '';
  isLoading = false;
  success = false;

  private readonly destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private resetPasswordService = inject(ResetPasswordService);

  goHome(): void {
    this.router.navigate(['/']).catch();
  }

  goToLogin(): void {
    this.router.navigate(['/login']).catch();
  }

  sendEmail(): void {
    if (this.emailControl.invalid) {
      return;
    }

    this.isLoading = true;

    this.resetPasswordService.reset(this.emailControl.value)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.success = true;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
