import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form8828',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8828.component.html',
  styleUrl: './form8828.component.css'
})
export class Form8828Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    closingDate: [''],
    saleDate: [''],
    l15_gainOnSale: [0],
    l16_subsidizedAmount: [0],
    l17_holdingPeriodPct: [0.10], // Example decimal for table lookup
    l19_adjustedQualifyingIncome: [0],
    l20_magi: [0]
  });

  // Signals
  recaptureAmount = computed(() => {
    const subsidized = (this.form.get('l16_subsidizedAmount')?.value || 0);
    const pct = (this.form.get('l17_holdingPeriodPct')?.value || 0);
    return subsidized * pct;
  });

  incomePercentage = computed(() => {
    const magi = (this.form.get('l20_magi')?.value || 0);
    const adjustedIncome = (this.form.get('l19_adjustedQualifyingIncome')?.value || 0);
    const diff = magi - adjustedIncome;
    if (diff <= 0) return 0;
    const pct = diff / 5000;
    return Math.min(pct, 1.0);
  });

  adjustedRecapture = computed(() => {
    return this.recaptureAmount() * this.incomePercentage();
  });

  halfGain = computed(() => (this.form.get('l15_gainOnSale')?.value || 0) * 0.5);

  finalRecaptureTax = computed(() => {
    return Math.min(this.adjustedRecapture(), this.halfGain());
  });

  onSubmit() {
    console.log('Form 8828 Submitted', this.form.value);
  }
}
