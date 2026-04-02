import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form965a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form965a.component.html',
  styleUrls: ['./form965a.component.css']
})
export class Form965aComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      taxpayer_name: [''], taxpayer_ssn: [''],
      // Part I
      line1: [''], line2: [''], installment_elect: [false],
      // Part II Tracking (Representative Row 1 for Year 1)
      p2_y1_m: [''], p2_y1_n: [''], p2_y1_o: [''], p2_y1_p: [''], p2_y1_q: [''],
      // Part III
      p3_line1: [''], p3_defer_elect: [false]
    });
  }

  onSubmit() {
    console.log('Submitted Form 965-A (2025):', this.form.value);
  }
}
