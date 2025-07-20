import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthserviceService } from '../authservice.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterModule, ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthserviceService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

 onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        //next: res => console.log('Login successful', res),
        next: () => {
        this.router.navigate(['/client-gallery']);
      },
        error: err => alert('Login failed')
      });
    }
  }
}
