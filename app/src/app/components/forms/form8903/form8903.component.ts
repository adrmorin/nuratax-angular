import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8903',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8903.component.html',
  styleUrls: ['./form8903.component.css']
})
export class Form8903Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  dpadComputed = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      // Part I - Domestic Production Activities Deduction
      line1: [0], // Domestic production gross receipts (DPGR)
      line2: [0], // Cost of goods sold allocable to DPGR
      line3: [0], // Direct and indirect expenses
      line4: [0], // Qualified production activities income (QPAI) (Line 1 - 2 - 3)
      line5: [0], // Taxable income before deduction
      line7: [0], // QPAI limit (9%)
      line10: [0], // Form W-2 wages
      line11: [0], // Wage limitation (50% of W-2 wages)
      line25: [0]  // Domestic production activities deduction (DPAD)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line1: number, line2: number, line3: number,
          line5: number, line10: number
      });
    });
  }

  calculateValues(val: {
      line1: number, line2: number, line3: number,
      line5: number, line10: number
  }): void {
      const qpai = (Number(val.line1) || 0) - (Number(val.line2) || 0) - (Number(val.line3) || 0);
      const taxableIncome = Number(val.line5) || 0;
      const lowerOfQpaiOrIncome = Math.min(Math.max(0, qpai), Math.max(0, taxableIncome));
      
      const tentativeDeduction = lowerOfQpaiOrIncome * 0.09;
      const wages = Number(val.line10) || 0;
      const wageLimit = wages * 0.50;

      const finalDpad = Math.min(tentativeDeduction, wageLimit);

      this.form.patchValue({
          line4: qpai,
          line7: tentativeDeduction,
          line11: wageLimit,
          line25: finalDpad
      }, { emitEvent: false });

      this.dpadComputed.set(finalDpad);
  }

  onSubmit(): void {
      console.log('Form 8903 Data:', this.form.value);
  }
}
