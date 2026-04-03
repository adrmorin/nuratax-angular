import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8889',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8889.component.html',
  styleUrls: ['./form8889.component.css']
})
export class Form8889Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  hsaDeduction = signal(0);
  taxableHsaDistributions = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      // Part I - Contributions
      line2: [0], // HSA contributions
      line3: [0], // Annual limitation
      line13: [0], // HSA deduction
      // Part II - Distributions
      line14a: [0], // Total distributions
      line15: [0], // Qualified medical expenses
      line16: [0]  // Taxable distributions (subtract line 15 from line 14a)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const deduction = Math.min(Number(val['line2']), Number(val['line3']));
      const taxable = Number(val['line14a']) - Number(val['line15']);
      
      this.form.patchValue({
          line13: deduction,
          line16: taxable > 0 ? taxable : 0
      }, { emitEvent: false });

      this.hsaDeduction.set(deduction);
      this.taxableHsaDistributions.set(taxable > 0 ? taxable : 0);
  }

  onSubmit(): void {
    console.log('Form 8889 Data:', this.form.value);
  }
}
