import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form1065',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1065.component.html',
  styleUrls: ['./form1065.component.css']
})
export class Form1065Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // Real-time calculation signals
  totalIncome = signal(0);
  totalDeductions = signal(0);
  ordIncomeLoss = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      address: [''],
      ein: [''],
      dateBusinessStarted: [''],
      principalBusinessActivity: [''],
      principalProductOrService: [''],
      line1a: [0], // Gross receipts or sales
      line1b: [0], // Returns and allowances
      line2: [0],  // Cost of goods sold
      line3: [0],  // Gross profit
      line4: [0],  // Ordinary income/loss from other partnerships
      line5: [0],  // Net farm profit/loss
      line6: [0],  // Net gain/loss from Form 4797
      line7: [0],  // Other income/loss
      line8: [0],  // Total income (lines 3 through 7)
      line9: [0],  // Salaries and wages
      line10: [0], // Guaranteed payments to partners
      line11: [0], // Repairs and maintenance
      line12: [0], // Bad debts
      line13: [0], // Rent
      line14: [0], // Taxes and licenses
      line15: [0], // Interest
      line16: [0], // Depreciation
      line17: [0], // Depletion
      line18: [0], // Retirement plans, etc.
      line19: [0], // Employee benefit programs
      line20: [0], // Other deductions
      line21: [0], // Total deductions (lines 9 through 20)
      line22: [0]  // Ordinary business income (loss) (line 8 minus line 21)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
    // Basic income sums
    const grossProfit = (Number(val['line1a']) - Number(val['line1b'])) - Number(val['line2']);
    const income = grossProfit + Number(val['line4']) + Number(val['line5']) + Number(val['line6']) + Number(val['line7']);
    this.totalIncome.set(income);

    // Deductions sums
    const deductions = Number(val['line9']) + Number(val['line10']) + Number(val['line11']) + Number(val['line12']) + 
                      Number(val['line13']) + Number(val['line14']) + Number(val['line15']) + Number(val['line16']) + 
                      Number(val['line17']) + Number(val['line18']) + Number(val['line19']) + Number(val['line20']);
    this.totalDeductions.set(deductions);

    // Final result
    this.ordIncomeLoss.set(income - deductions);

    // Auto-update form fields for totals
    this.form.patchValue({
        line3: grossProfit,
        line8: income,
        line21: deductions,
        line22: income - deductions
    }, { emitEvent: false });
  }

  onSubmit(): void {
    console.log('Form 1065 Data:', this.form.value);
  }
}
