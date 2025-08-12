import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  form!: FormGroup;
  step: number = 1;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  nextStep(): void {
    if (this.form.get('email')?.valid) {
      this.step = 2;
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      this.authService.register(this.form.value).subscribe({
        next: (res) => {
          console.log('Регистрация успешна', res);
          this.router.navigate(['/client-gallery']).then((success) => {
            console.log('Навигация успешна?', success);
          });
        },
        error: (err) => {
          console.error('Ошибка при регистрации:', err);
          alert('Регистрация не удалась');
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }
}
