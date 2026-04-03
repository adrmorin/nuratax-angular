import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-schedule8812',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule8812.component.html',
  styleUrls: ['./schedule8812.component.css']
})
export class Schedule8812Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    agi: [0],
    numChildren: [0],
    numOtherDependents: [0],
    taxLiability: [0],
    earnedIncome: [0],
    filingStatus: ['single'] // single, mfj
  });

  // Constants for 2025
  MAX_CTC = 2200;
  MAX_ACTC = 1700;
  MAX_ODC = 500;

  // Part I: Calculations
  potentialCTC = computed(() => (this.form.get('numChildren')?.value || 0) * this.MAX_CTC);
  potentialODC = computed(() => (this.form.get('numOtherDependents')?.value || 0) * this.MAX_ODC);
  totalPotential = computed(() => this.potentialCTC() + this.potentialODC());

  threshold = computed(() => {
    return this.form.get('filingStatus')?.value === 'mfj' ? 400000 : 200000;
  });

  phaseOut = computed(() => {
    const agi = this.form.get('agi')?.value || 0;
    const excess = Math.max(0, agi - this.threshold());
    return Math.ceil(excess / 1000) * 50;
  });

  finalCTC = computed(() => Math.max(0, this.totalPotential() - this.phaseOut()));

  // Part II: ACTC (Simple version)
  earnedIncomeLimit = computed(() => {
    const ei = this.form.get('earnedIncome')?.value || 0;
    return Math.max(0, (ei - 2500) * 0.15);
  });

  maxACTCPossible = computed(() => (this.form.get('numChildren')?.value || 0) * this.MAX_ACTC);
  
  actc = computed(() => {
    const excessCredit = Math.max(0, this.finalCTC() - (this.form.get('taxLiability')?.value || 0));
    return Math.min(excessCredit, this.maxACTCPossible(), this.earnedIncomeLimit());
  });

  onSubmit() {
    console.log('Schedule 8812 Submitted', this.form.value);
  }
}
