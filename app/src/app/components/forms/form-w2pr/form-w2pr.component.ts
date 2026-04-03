import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-w2pr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-w2pr.component.html',
  styleUrls: ['./form-w2pr.component.css']
})
export class FormW2PRComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    controlNumber: [''],
    taxYear: ['2025'],
    employerName: [''],
    employerEIN: [''],
    employeeName: [''],
    employeeSSN: [''],
    
    // Box 7-10 (Income components)
    wages: [0],
    commissions: [0],
    allowances: [0],
    tips: [0],
    
    // Withholding
    taxWithheld: [0],
    codaContributions: [0],
    
    // FICA (Federal)
    ssWages: [0],
    ssTax: [0],
    medWages: [0],
    medTax: [0]
  });

  // Box 11: Total Income
  totalIncome = computed(() => {
    const v = this.form.value;
    return (v.wages || 0) + (v.commissions || 0) + (v.allowances || 0) + (v.tips || 0);
  });

  // Basic validation constants for 2025
  SS_LIMIT = 176100;
  SS_RATE = 0.062;
  MED_RATE = 0.0145;

  calculateFICA() {
    const income = this.totalIncome();
    const ssWages = Math.min(income, this.SS_LIMIT);
    this.form.patchValue({
      ssWages,
      ssTax: Number((ssWages * this.SS_RATE).toFixed(2)),
      medWages: income,
      medTax: Number((income * this.MED_RATE).toFixed(2))
    }, { emitEvent: false });
  }

  onSubmit() {
    console.log('Form W-2PR Submitted', this.form.value);
  }
}
