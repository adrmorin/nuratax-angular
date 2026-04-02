import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form3903',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form3903.component.html',
  styleUrls: ['./form3903.component.css']
})
export class Form3903Component {
  form3903: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form3903 = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [''],
      line2: [''],
      line3: [''],
      line4: [''],
      line5Yes: [false],
      line5No: [false],
      line5Value: ['']
    });
  }

  onSubmit() {
    console.log('Form 3903 submitted:', this.form3903.value);
  }
}
