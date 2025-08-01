import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {ResetPasswordService} from '../services/reset-password.service';

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

  private router = inject(Router);
  private resetPasswordService = inject(ResetPasswordService);
  goHome() {
    this.router.navigate(['/']).catch();
  }

  goToLogin() {
    this.router.navigate(['/login']).catch();
  }

  sendEmail() {
    if (this.emailControl.invalid) {
      return;
    }

    this.isLoading = true;

    this.resetPasswordService.reset(this.emailControl.value)
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
