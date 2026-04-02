import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8919',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8919.component.html',
  styleUrls: ['./form8919.component.css']
})
export class Form8919Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], ssn: [''],
      // Part II Table (Representative Row 1)
      p2_row1a: [''], p2_row1b: [''], p2_row1c: [''], p2_row1d: [''], p2_row1e: [false], p2_row1f: [''],
      // Part II Calculation
      line6: [''], line7: [''], line8: ['176100'], line9: [''], line10: [''], line11: [''], line12: [''], line13: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8919 (2025):', this.form.value);
  }
}