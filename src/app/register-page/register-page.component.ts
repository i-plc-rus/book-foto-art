import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { AuthserviceService } from '../authservice.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterModule,],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {
form!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthserviceService) {}

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
        next: res => console.log('Login successful', res),
        error: err => alert('Login failed')
      });
    }
  }
}
