import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form4137',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4137.component.html',
  styleUrls: ['./form4137.component.css']
})
export class Form4137Component {
  form4137: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form4137 = this.fb.group({
      name: [''],
      ssn: [''],
      employers: this.fb.array([
        this.createEmployerGroup(),
        this.createEmployerGroup(),
        this.createEmployerGroup(),
        this.createEmployerGroup(),
        this.createEmployerGroup()
      ]),
      line2: [''],
      line3: [''],
      line4: [''],
      line5: [''],
      line6: [''],
      line7: [176100], // 2025 limit
      line8: [''],
      line9: [''],
      line10: [''],
      line11: [''],
      line12: [''],
      line13: ['']
    });
  }

  createEmployerGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      ein: [''],
      totalReceived: [''],
      totalReported: ['']
    });
  }

  get employers(): FormArray {
    return this.form4137.get('employers') as FormArray;
  }

  onSubmit() {
    console.log('Form 4137 submitted:', this.form4137.value);
  }
}
