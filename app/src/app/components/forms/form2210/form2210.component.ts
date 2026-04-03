import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form2210',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form2210.component.html',
  styleUrls: ['./form2210.component.css']
})
export class Form2210Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    taxShown: [0], // Line 1
    withholding: [0], // Line 2
    priorYearTax: [0], // Line 8
    isHighIncome: [false], // If AGI > $150k
    
    // Part II Checkboxes
    requestWaiver: [false],
    annualizedIncome: [false],
    specialRules: [false]
  });

  // Calculations for Part I
  netTax = computed(() => Math.max(0, (this.form.get('taxShown')?.value || 0) - (this.form.get('withholding')?.value || 0)));
  
  currentYearRequired = computed(() => (this.form.get('taxShown')?.value || 0) * 0.9);
  
  priorYearRequired = computed(() => {
    const prior = this.form.get('priorYearTax')?.value || 0;
    return this.form.get('isHighIncome')?.value ? prior * 1.1 : prior;
  });

  requiredAnnualPayment = computed(() => Math.min(this.currentYearRequired(), this.priorYearRequired()));

  owePenalty = computed(() => {
    const diff = (this.form.get('taxShown')?.value || 0) - (this.form.get('withholding')?.value || 0);
    return diff >= 1000 && (this.form.get('withholding')?.value || 0) < this.requiredAnnualPayment();
  });

  onSubmit() {
    console.log('Form 2210 Submitted', this.form.value);
  }
}
