import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8611',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8611.component.html',
  styleUrls: ['./form8611.component.css']
})
export class Form8611Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  recaptureAmount = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line8: [0], // Total credit allowed
      line9: [0], // Net investment income
      line14: [0] // Recapture amount
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      // Simplified recapture logic for demo
      const recapture = Number(val['line8']) * 0.33; // 1/3 recapture rate example
      
      this.form.patchValue({
          line14: recapture
      }, { emitEvent: false });

      this.recaptureAmount.set(recapture);
  }

  onSubmit(): void {
    console.log('Form 8611 Data:', this.form.value);
  }
}