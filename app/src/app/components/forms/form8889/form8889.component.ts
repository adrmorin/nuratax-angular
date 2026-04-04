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
  taxableDistributions = signal(0);
  additionalTax = signal(0); // 20% additional tax on taxable distributions

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      // Part I - Contributions and Deductions
      hsaType: ['self-only'], // self-only or family
      line2: [0], // HSA contributions you made
      line3: [4150], // Annual limitation (Self-only $4,150, Family $8,300)
      line7: [0], // Catch-up contributions (age 55 or older)
      line13: [0], // HSA deduction. Enter the smaller of line 2 or total deduction limit.
      // Part II - Distributions
      line14a: [0], // Total distributions from HSAs
      line15: [0], // Qualified medical expenses
      line16: [0], // Taxable distributions (line 14a minus line 15)
      line17b: [0] // Additional 20% tax (line 16 * 0.20)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {hsaType: string, line2: number, line3: number, line7: number, line14a: number, line15: number});
    });
  }

  calculateValues(val: {hsaType: string, line2: number, line3: number, line7: number, line14a: number, line15: number}): void {
      // Annual Limit based on coverage type
      const baseLimit = val.hsaType === 'family' ? 8300 : 4150;
      const catchup = Number(val['line7']) || 0;
      const totalLimit = baseLimit + catchup;

      const contribs = Number(val['line2']) || 0;
      const deduction = Math.min(contribs, totalLimit);
      
      const distTotal = Number(val['line14a']) || 0;
      const expenses = Number(val['line15']) || 0;
      const taxable = Math.max(0, distTotal - expenses);
      const addTax = taxable * 0.20;
      
      this.form.patchValue({
          line3: baseLimit,
          line13: deduction,
          line16: taxable,
          line17b: addTax
      }, { emitEvent: false });

      this.hsaDeduction.set(deduction);
      this.taxableDistributions.set(taxable);
      this.additionalTax.set(addTax);
  }

  onSubmit(): void {
    console.log('Form 8889 Data:', this.form.value);
  }
}
