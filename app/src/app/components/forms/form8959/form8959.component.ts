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
  totalAdditionalTax = signal(0);
  threshold = signal(200000);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      filingStatus: ['single'],
      // Part I - Wages
      line1: [0], // Medicare wages and tips
      line4: [0], // Line 1 minus threshold
      line7: [0], // Line 4 * 0.9%
      // Part II - SE Income
      line8: [0], // Total SE income
      line13: [0], // Part II tax (Line 12 * 0.9%)
      // Part III - RRTA
      line14: [0], // RRTA compensation
      line17: [0]  // Part III tax (Line 16 * 0.9%)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {filingStatus: string, line1: number, line8: number, line14: number});
    });
  }

  calculateValues(val: {filingStatus: string, line1: number, line8: number, line14: number}): void {
      const status = val.filingStatus;
      let limit = 200000;
      if (status === 'mfj') limit = 250000;
      if (status === 'mfs') limit = 125000;
      
      this.threshold.set(limit);

      const wages = Number(val.line1) || 0;
      const se = Number(val.line8) || 0;
      const rrta = Number(val.line14) || 0;

      // Part I
      const wagesExcess = Math.max(0, wages - limit);
      const taxWages = wagesExcess * 0.009;

      // Part II (Simplified threshold logic)
      const seRemainingLimit = Math.max(0, limit - wages);
      const seExcess = Math.max(0, se - seRemainingLimit);
      const taxSE = seExcess * 0.009;

      // Part III
      const rrtaExcess = Math.max(0, rrta - limit);
      const taxRRTA = rrtaExcess * 0.009;

      const totalValue = taxWages + taxSE + taxRRTA;

      this.form.patchValue({
          line4: wagesExcess,
          line7: taxWages,
          line13: taxSE,
          line17: taxRRTA
      }, { emitEvent: false });

      this.totalAdditionalTax.set(totalValue);
  }

  onSubmit(): void {
    console.log('Form 8959 Data:', this.form.value);
  }
}
