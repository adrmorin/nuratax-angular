import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8995a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8995a.component.html',
  styleUrls: ['./form8995a.component.css']
})
export class Form8995aComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  qbiDeductionComputed = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      filingStatus: ['single'],
      // Part I - Trade, Business, or Aggregation Information
      businessName: [''],
      ein: [''],
      // Part II - Determination of QBI
      line1: [0], // QBI or (loss)
      line2: [0], // Reduction for allocation
      line3: [0], // Net QBI (Line 1 - 2)
      // Part III - W-2 Wages and UBIA
      line4: [0], // W-2 Wages
      line5: [0], // UBIA
      // Part IV - Calculation of QBI Deduction
      line6: [0], // 20% of line 3
      line7: [0], // 50% of W-2 Wages
      line8: [0], // 25% of W-2 Wages + 2.5% of UBIA
      line15: [0] // Tentative QBI deduction
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line1: number, line2: number, 
          line4: number, line5: number
      });
    });
  }

  calculateValues(val: {
      line1: number, line2: number, 
      line4: number, line5: number
  }): void {
      const qbi = (Number(val.line1) || 0) - (Number(val.line2) || 0);
      const wages = Number(val.line4) || 0;
      const ubia = Number(val.line5) || 0;

      const base20 = qbi * 0.20;
      const wageLimit50 = wages * 0.50;
      const wageLimit25 = (wages * 0.25) + (ubia * 0.025);
      
      const greaterWageLimit = Math.max(wageLimit50, wageLimit25);
      const tentative = Math.min(base20, greaterWageLimit);

      this.form.patchValue({
          line3: qbi,
          line6: base20,
          line7: wageLimit50,
          line8: wageLimit25,
          line15: tentative
      }, { emitEvent: false });

      this.qbiDeductionComputed.set(tentative);
  }

  onSubmit(): void {
      console.log('Form 8995-A Data:', this.form.value);
  }
}
