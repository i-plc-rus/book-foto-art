import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  form!: FormGroup;
  step: number = 1;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  nextStep() {
    if (this.form.get('email')?.valid) {
      this.step = 2;
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.register(this.form.value).subscribe({
        next: (res) => {
          console.log('Регистрация успешна', res);
          this.router.navigate(['/client-gallery']).then(success => {
            console.log('Навигация успешна?', success);
          });
        },
        error: (err) => {
          console.error('Ошибка при регистрации:', err);
          alert('Регистрация не удалась');
        }
      });
    }
  }

}
