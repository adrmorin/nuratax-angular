import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-schedule-a-1040',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-a-1040.component.html',
  styleUrl: './schedule-a-1040.component.css'
})
// Schedule A (Form 1040) - Itemized Deductions
export class ScheduleA1040Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    // Medical
    l1_medical: [0],
    l2_agi: [0],
    // Taxes
    l5a_stateLocalIncome: [0],
    l5b_stateLocalRealEstate: [0],
    l5c_stateLocalPersonalProperty: [0],
    l6_otherTaxes: [0],
    // Interest
    l8a_homeMortgageBank: [0],
    l8b_homeMortgageNotBank: [0],
    l8c_pointsNotReported: [0],
    l8d_mortgageInsurance: [0],
    l9_investmentInterest: [0],
    // Charity
    l11_cashCharity: [0],
    l12_noncashCharity: [0],
    l13_carryoverCharity: [0],
    // Casualty
    l15_casualtyLoss: [0],
    // Other
    l16_otherDeductions: [0]
  });

  // Signals for responsive arithmetic
  medicalThreshold = computed(() => (this.form.get('l2_agi')?.value || 0) * 0.075);
  medicalDeduction = computed(() => {
    const expenses = this.form.get('l1_medical')?.value || 0;
    const threshold = this.medicalThreshold();
    const diff = expenses - threshold;
    return diff > 0 ? diff : 0;
  });

  taxesPaidTotal = computed(() => {
    const sum = (this.form.get('l5a_stateLocalIncome')?.value || 0) +
                (this.form.get('l5b_stateLocalRealEstate')?.value || 0) +
                (this.form.get('l5c_stateLocalPersonalProperty')?.value || 0) +
                (this.form.get('l6_otherTaxes')?.value || 0);
    // Note: Line 5e limitation ($10,000 MFS $5,000) not implemented for simplicity here, but can be added.
    return sum;
  });

  interestPaidTotal = computed(() => {
    return (this.form.get('l8a_homeMortgageBank')?.value || 0) +
           (this.form.get('l8b_homeMortgageNotBank')?.value || 0) +
           (this.form.get('l8c_pointsNotReported')?.value || 0) +
           (this.form.get('l8d_mortgageInsurance')?.value || 0) +
           (this.form.get('l9_investmentInterest')?.value || 0);
  });

  charityTotal = computed(() => {
    return (this.form.get('l11_cashCharity')?.value || 0) +
           (this.form.get('l12_noncashCharity')?.value || 0) +
           (this.form.get('l13_carryoverCharity')?.value || 0);
  });

  totalDeductions = computed(() => {
    return this.medicalDeduction() +
           this.taxesPaidTotal() +
           this.interestPaidTotal() +
           this.charityTotal() +
           (this.form.get('l15_casualtyLoss')?.value || 0) +
           (this.form.get('l16_otherDeductions')?.value || 0);
  });

  onSubmit() {
    console.log('Schedule A Submitted', this.form.value);
  }
}
