import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    if (this.isSubmitting || this.form.invalid) return;

    this.isSubmitting = true;

    this.authService.register(this.form.value).subscribe({
      next: async () => {
        // ВАЖНО: не сбрасываем флаг — кнопка остаётся disabled до уничтожения компонента
        await this.router.navigate(['/client-gallery']);
      },
      error: (err) => {
        console.error('Ошибка при регистрации:', err);
        alert('Регистрация не удалась');
        // Разрешаем повторную попытку только при ошибке
        this.isSubmitting = false;
      },
    });
  }
}
