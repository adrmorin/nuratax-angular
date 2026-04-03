import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form1120s',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1120s.component.html',
  styleUrls: ['./form1120s.component.css']
})
export class Form1120sComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalIncome = signal(0);
  totalDeductions = signal(0);
  ordBusinessIncome = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      address: [''],
      ein: [''],
      dateIncorporated: [''],
      totalAssets: [0],
      line1a: [0], // Gross receipts or sales
      line1b: [0], // returns and allowances
      line2: [0],  // Cost of goods sold
      line3: [0],  // Gross profit
      line4: [0],  // Net gain/loss from Form 4797
      line5: [0],  // Other income/loss
      line6: [0],  // Total income (lines 3 through 5)
      line7: [0],  // Compensation of officers
      line8: [0],  // Salaries and wages
      line9: [0],  // Repairs and maintenance
      line10: [0], // Bad debts
      line11: [0], // Rent
      line12: [0], // Taxes and licenses
      line13: [0], // Interest
      line14: [0], // Depreciation
      line15: [0], // Depletion
      line16: [0], // Advertising
      line17: [0], // Pension, profit-sharing plans
      line18: [0], // Employee benefit programs
      line19: [0], // Other deductions
      line20: [0], // Total deductions (lines 7 through 19)
      line21: [0]  // Ordinary business income (loss) (line 6 minus line 20)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const grossProfit = (Number(val['line1a']) - Number(val['line1b'])) - Number(val['line2']);
      const income = grossProfit + Number(val['line4']) + Number(val['line5']);
      this.totalIncome.set(income);

      const deductions = Number(val['line7']) + Number(val['line8']) + Number(val['line9']) + 
                        Number(val['line10']) + Number(val['line11']) + Number(val['line12']) + 
                        Number(val['line13']) + Number(val['line14']) + Number(val['line15']) + 
                        Number(val['line16']) + Number(val['line17']) + Number(val['line18']) + 
                        Number(val['line19']);
      this.totalDeductions.set(deductions);

      this.ordBusinessIncome.set(income - deductions);

      this.form.patchValue({
          line3: grossProfit,
          line6: income,
          line20: deductions,
          line21: income - deductions
      }, { emitEvent: false });
  }

  onSubmit(): void {
    console.log('Form 1120-S Data:', this.form.value);
  }
}
