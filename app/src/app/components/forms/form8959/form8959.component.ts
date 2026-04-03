import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form8959',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8959.component.html',
  styleUrls: ['./form8959.component.css']
})
export class Form8959Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    filingStatus: ['single'], // single, mfj, mfs, hoh, qss
    
    // Part I
    medicareWages: [0],
    unreportedTips: [0],
    
    // Part II
    seIncome: [0],
    
    // Part III
    rrtaComp: [0],
    
    // Part V
    medicareTaxWithheld: [0],
    additionalWithholding: [0]
  });

  // Thresholds for 2025
  threshold = computed(() => {
    const status = this.form.get('filingStatus')?.value;
    switch(status) {
      case 'mfj': return 250000;
      case 'mfs': return 125000;
      default: return 200000;
    }
  });

  // Part I Calculation
  totalWages = computed(() => (this.form.get('medicareWages')?.value || 0) + (this.form.get('unreportedTips')?.value || 0));
  part1Tax = computed(() => {
    const excess = Math.max(0, this.totalWages() - this.threshold());
    return excess * 0.009;
  });

  // Part II Calculation
  part2Tax = computed(() => {
    const se = this.form.get('seIncome')?.value || 0;
    const remainingThreshold = Math.max(0, this.threshold() - this.totalWages());
    const excessSE = Math.max(0, se - remainingThreshold);
    return excessSE * 0.009;
  });

  // Part III Calculation
  part3Tax = computed(() => {
    const rrta = this.form.get('rrtaComp')?.value || 0;
    const excessRRTA = Math.max(0, rrta - this.threshold());
    return excessRRTA * 0.009;
  });

  totalTax = computed(() => this.part1Tax() + this.part2Tax() + this.part3Tax());

  onSubmit() {
    console.log('Form 8959 Submitted', this.form.value);
  }
}
