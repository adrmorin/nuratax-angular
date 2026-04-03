import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form8396',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8396.component.html',
  styleUrl: './form8396.component.css'
})
export class Form8396Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    l1_creditRate: [0],
    l2_interestPaid: [0],
    l4_carryforward2019: [0],
    l5_carryforward2020: [0],
    l6_carryforward2021: [0]
  });

  currentYearCredit = computed(() => {
    const rate = (this.form.get('l1_creditRate')?.value || 0) / 100;
    const interest = (this.form.get('l2_interestPaid')?.value || 0);
    const calculated = rate * interest;
    // Cap at $2,000 if rate > 20%
    if (rate > 0.20) {
      return Math.min(calculated, 2000);
    }
    return calculated;
  });

  totalAvailableCredit = computed(() => {
    return this.currentYearCredit() +
           (this.form.get('l4_carryforward2019')?.value || 0) +
           (this.form.get('l5_carryforward2020')?.value || 0) +
           (this.form.get('l6_carryforward2021')?.value || 0);
  });

  onSubmit() {
    console.log('Form 8396 Submitted', this.form.value);
  }
}
