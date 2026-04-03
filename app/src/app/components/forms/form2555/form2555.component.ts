import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form2555',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form2555.component.html',
  styleUrl: './form2555.component.css'
})
export class Form2555Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    foreignAddress: [''],
    occupation: [''],
    employerName: [''],
    employerAddress: [''],
    employerType: ['US'], // US, Foreign, Other
    // Part IV: Foreign Earned Income
    wages: [0],
    allowances: [0],
    noncashHousing: [0],
    businessIncome: [0],
    // Part VI: Housing
    qualifiedHousingExpenses: [0],
    numberOfDays: [365],
    baseHousingAmount: [computed(() => 57.10 * 365)], // Placeholder rate logic
  });

  // Signals for reactive totals
  totalForeignEarnedIncome = computed(() => {
    return (this.form.get('wages')?.value || 0) +
           (this.form.get('allowances')?.value || 0) +
           (this.form.get('noncashHousing')?.value || 0) +
           (this.form.get('businessIncome')?.value || 0);
  });

  onSubmit() {
    console.log('Form 2555 Submitted', this.form.value);
  }
}
