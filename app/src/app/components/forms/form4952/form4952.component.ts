import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form4952',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4952.component.html',
  styleUrls: ['./form4952.component.css']
})
export class Form4952Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  netInvestmentIncome = signal(0);
  allowableDeduction = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Investment interest expense
      line4a: [0], // Gross investment income
      line4b: [0], // Qualified dividends
      line6: [0], // Net investment income
      line8: [0]  // Investment interest expense deduction
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const netIncome = Number(val['line4a']) - Number(val['line4b']);
      const deduction = Math.min(Number(val['line1']), netIncome);
      
      this.form.patchValue({
          line6: netIncome,
          line8: deduction
      }, { emitEvent: false });

      this.netInvestmentIncome.set(netIncome);
      this.allowableDeduction.set(deduction);
  }

  onSubmit(): void {
    console.log('Form 4952 Data:', this.form.value);
  }
}
