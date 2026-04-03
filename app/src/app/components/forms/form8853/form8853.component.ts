import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8853',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8853.component.html',
  styleUrls: ['./form8853.component.css']
})
export class Form8853Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  taxableMsaDistributions = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      // Part I - Archer MSAs
      line1: [0], // Total distributions
      line2: [0], // Qualified medical expenses
      line3: [0], // Taxable distributions (subtract line 2 from line 1)
      line4: [0], // Distributions that qualify for exclusion
      line5: [0]  // Taxable MSA distributions
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const taxable = Number(val['line1']) - Number(val['line2']);
      const finalTaxable = taxable > 0 ? taxable - Number(val['line4']) : 0;
      
      this.form.patchValue({
          line3: taxable > 0 ? taxable : 0,
          line5: finalTaxable > 0 ? finalTaxable : 0
      }, { emitEvent: false });

      this.taxableMsaDistributions.set(finalTaxable > 0 ? finalTaxable : 0);
  }

  onSubmit(): void {
    console.log('Form 8853 Data:', this.form.value);
  }
}
