import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8959',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8959.component.html',
  styleUrls: ['./form8959.component.css']
})
export class Form8959Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  additionalTax = signal(0);
  thresholdAmount = signal(200000);

  ngOnInit(): void {
    this.form = this.fb.group({
      filingStatus: ['single'], // single, mfj, mfs, hoh, qw
      medicareWages: [0],
      selfEmploymentIncome: [0],
      totalIncome: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const status = val['filingStatus'];
      let threshold = 200000;
      if (status === 'mfj') threshold = 250000;
      if (status === 'mfs') threshold = 125000;
      
      this.thresholdAmount.set(threshold);

      const wages = Number(val['medicareWages']) || 0;
      const se = Number(val['selfEmploymentIncome']) || 0;
      const total = wages + se;
      
      this.form.patchValue({
          totalIncome: total
      }, { emitEvent: false });

      const excess = Math.max(0, total - threshold);
      this.additionalTax.set(excess * 0.009); // 0.9% additional medicare tax
  }

  onSubmit(): void {
    console.log('Form 8959 Data:', this.form.value);
  }
}
