import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-form8978',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8978.component.html',
  styleUrl: './form8978.component.css'
})
export class Form8978Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    partnerName: [''],
    partnerTIN: [''],
    isBBA: [false],
    isAAR: [false],
    years: this.fb.array([
      this.createYearGroup(),
      this.createYearGroup(),
      this.createYearGroup(),
      this.createYearGroup()
    ]),
    penalties: [0],
    interest: [0]
  });

  createYearGroup() {
    return this.fb.group({
      yearEnded: [''],
      l1a: [0], // Original total income
      l1b: [0], // Adjustments (from Schedule A)
      l3a: [0], // Original deductions
      l3b: [0], // Adjustments (from Schedule A)
      l6: [0],  // Income tax
      l11b: [0] // Credit adjustments
    });
  }

  get years() { return this.form.get('years') as FormArray; }

  // Computed totals per year
  yearTotals = computed(() => {
    return this.years.controls.map(ctrl => {
      const v = ctrl.value;
      const l2 = (v.l1a || 0) + (v.l1b || 0);
      const l4 = (v.l3a || 0) + (v.l3b || 0);
      // Simplified calculation for demo
      const l14 = (v.l6 || 0) - (v.l11b || 0); 
      return { l2, l4, l14 };
    });
  });

  totalTax = computed(() => {
    const yearsSum = this.yearTotals().reduce((sum, y) => sum + y.l14, 0);
    return yearsSum + (this.form.get('penalties')?.value || 0) + (this.form.get('interest')?.value || 0);
  });

  onSubmit() {
    console.log('Form 8978 Submitted', this.form.value);
  }
}
