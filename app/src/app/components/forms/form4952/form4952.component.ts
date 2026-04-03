import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form4952',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4952.component.html',
  styleUrl: './form4952.component.css'
})
export class Form4952Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    l1_currentInterest: [0],
    l2_carryoverInterest: [0],
    l4a_grossInvestmentIncome: [0],
    l4b_qualifiedDividends: [0],
    l4c_capitalGains: [0],
    l5_investmentExpenses: [0]
  });

  // Signals
  totalInterest = computed(() => {
    return (this.form.get('l1_currentInterest')?.value || 0) +
           (this.form.get('l2_carryoverInterest')?.value || 0);
  });

  netInvestmentIncome = computed(() => {
    const gross = (this.form.get('l4a_grossInvestmentIncome')?.value || 0);
    const expenses = (this.form.get('l5_investmentExpenses')?.value || 0);
    return gross - expenses;
  });

  deduction = computed(() => {
    return Math.min(this.totalInterest(), this.netInvestmentIncome());
  });

  onSubmit() {
    console.log('Form 4952 Submitted', this.form.value);
  }
}
