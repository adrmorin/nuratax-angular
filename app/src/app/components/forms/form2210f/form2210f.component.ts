import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form2210f',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form2210f.component.html',
  styleUrls: ['./form2210f.component.css']
})
export class Form2210FComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    tax2024: [0], // Current Year Tax
    withholding: [0],
    tax2023: [0], // Prior Year Tax
    isFarmer: [true],
    isFisherman: [false],
    filingDeadlineDate: ['2025-03-01'] // March 1st deadline
  });

  // Farmers/Fishermen only need 2/3 of current tax
  currentYearRequired = computed(() => (this.form.get('tax2024')?.value || 0) * (2/3));
  
  priorYearRequired = computed(() => this.form.get('tax2023')?.value || 0);

  requiredAnnualPayment = computed(() => Math.min(this.currentYearRequired(), this.priorYearRequired()));

  underpayment = computed(() => {
    const paid = this.form.get('withholding')?.value || 0;
    return Math.max(0, this.requiredAnnualPayment() - paid);
  });

  // Penalty Calculation (Simplified 8% rate for early 2025)
  penalty = computed(() => {
    const up = this.underpayment();
    if (up <= 0) return 0;
    // Assuming 15 days late for a simple demo calculation
    return up * 0.08 * (15 / 365);
  });

  onSubmit() {
    console.log('Form 2210-F Submitted', this.form.value);
  }
}
