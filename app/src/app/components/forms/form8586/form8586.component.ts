import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8586',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8586.component.html',
  styleUrls: ['./form8586.component.css']
})
export class Form8586Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], identNumber: [''],
      line1: [''],
      line2i: [false], line2ii: [false], line2iii: [false], line2iv: [false],
      line3: [''], line4: [''], line5: [''], line6: [''], line7: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8586 (2025):', this.form.value);
  }
}