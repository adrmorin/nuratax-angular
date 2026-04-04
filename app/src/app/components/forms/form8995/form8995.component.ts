import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8995',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8995.component.html',
  styleUrls: ['./form8995.component.css']
})
export class Form8995Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  qbiDeduction = signal(0);
  householdThreshold = signal(191950);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      filingStatus: ['single'],
      // Part I - QBI for each Trade or Business
      line1a_name: [''],
      line1a_qbi: [0],
      line1b_name: [''],
      line1b_qbi: [0],
      line1c_name: [''],
      line1c_qbi: [0],
      line2: [0], // Total QBI (sum of 1a-1c)
      line3: [0], // 20% of line 2
      // Part II - Deduction Calculation
      line11: [0], // Taxable income before QBI deduction
      line12: [0], // Net capital gain
      line13: [0], // Taxable income minus capital gain (Line 11 - 12)
      line14: [0], // 20% of line 13
      line15: [0]  // QBI Deduction (lesser of line 3 or line 14)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
        filingStatus: string, 
        line1a_qbi: number, line1b_qbi: number, line1c_qbi: number,
        line11: number, line12: number
      });
    });
  }

  calculateValues(val: {
    filingStatus: string, 
    line1a_qbi: number, line1b_qbi: number, line1c_qbi: number,
    line11: number, line12: number
  }): void {
      const status = val.filingStatus;
      let threshold = 191950; // 2024 single/hoh/mfs
      if (status === 'mfj') threshold = 383900;
      this.householdThreshold.set(threshold);

      const qbiTotal = (Number(val.line1a_qbi) || 0) + (Number(val.line1b_qbi) || 0) + (Number(val.line1c_qbi) || 0);
      const line3 = qbiTotal * 0.20;

      const taxableIncome = Number(val.line11) || 0;
      const capitalGain = Number(val.line12) || 0;
      const incomeMinusGain = Math.max(0, taxableIncome - capitalGain);
      const line14 = incomeMinusGain * 0.20;

      const finalDeduction = Math.min(line3, line14);

      this.form.patchValue({
          line2: qbiTotal,
          line3: line3,
          line13: incomeMinusGain,
          line14: line14,
          line15: finalDeduction
      }, { emitEvent: false });

      this.qbiDeduction.set(finalDeduction);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form 8995 Data:', this.form.value);
      // Implementation for saving or processing
    }
  }
}
