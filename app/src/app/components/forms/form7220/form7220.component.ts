import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form7220',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form7220.component.html',
  styleUrls: ['./form7220.component.css']
})
export class Form7220Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''],
      identifyingNumber: [''],
      // Part I
      regNumber: [''],
      projectDesc: [''],
      latitude: [''], // Will handle as string or digits
      longitude: [''],
      // Part II
      laborCategory: [''],
      wageRate: [''],
      hoursWorked: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 7220 (2025):', this.form.value);
  }
}