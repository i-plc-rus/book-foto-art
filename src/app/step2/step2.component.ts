import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step2',
  imports: [ReactiveFormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component implements OnInit {
  form!: FormGroup;


  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onNext() {
    if (this.form.valid) {
      const data = this.form.value;
      localStorage.setItem('galleryMeta', JSON.stringify(data));
      this.router.navigate(['/create-gallery/step-3']);
    }
  }
}
