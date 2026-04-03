import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8960',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8960.component.html',
  styleUrls: ['./form8960.component.css']
})
export class Form8960Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  niitTax = signal(0);
  magiThreshold = signal(200000);

  ngOnInit(): void {
    this.form = this.fb.group({
      filingStatus: ['single'], // single, mfj, mfs, hoh, qw
      netInvestmentIncome: [0],
      magi: [0],
      modifiedAdjustedGrossIncome: [0]
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
      
      this.magiThreshold.set(threshold);

      const nii = Number(val['netInvestmentIncome']) || 0;
      const magiValue = Number(val['magi']) || 0;
      const excessMagi = Math.max(0, magiValue - threshold);
      
      const lesserOf = Math.min(nii, excessMagi);
      this.niitTax.set(lesserOf * 0.038); // 3.8% NIIT
  }

  onSubmit(): void {
    console.log('Form 8960 Data:', this.form.value);
  }
}