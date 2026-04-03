import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-salt-worksheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './salt-worksheet.component.html',
  styleUrl: './salt-worksheet.component.css'
})
export class SaltWorksheetComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    l1_stateLocalTaxes: [0],
    l2_otherTaxes: [0],
    filingStatus: ['single'] // single (10k), mfs (5k)
  });

  totalTaxes = computed(() => {
    return (this.form.get('l1_stateLocalTaxes')?.value || 0) +
           (this.form.get('l2_otherTaxes')?.value || 0);
  });

  limitation = computed(() => {
    return this.form.get('filingStatus')?.value === 'mfs' ? 5000 : 10000;
  });

  finalDeduction = computed(() => {
    return Math.min(this.totalTaxes(), this.limitation());
  });

  onSubmit() {
    console.log('SALT Worksheet Submitted', this.form.value);
  }
}
