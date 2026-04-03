import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8915f',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8915f.component.html',
  styleUrls: ['./form8915f.component.css']
})
export class Form8915fComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  taxableAmount = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Total distributions
      line2: [0], // Distributions included on line 1 that aren't qualified
      line3: [0], // Qualified disaster distributions (subtract line 2 from line 1)
      line4: [0], // Amount from line 3 spread over 3 years
      line5: [0], // Repayments
      line6: [0]  // Taxable amount (line 4 minus line 5)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const line3Value = Number(val['line1']) - Number(val['line2']);
      const spreadValue = line3Value / 3;
      const taxable = spreadValue - Number(val['line5']);
      
      this.form.patchValue({
          line3: line3Value,
          line4: spreadValue,
          line6: taxable > 0 ? taxable : 0
      }, { emitEvent: false });

      this.taxableAmount.set(taxable > 0 ? taxable : 0);
  }

  onSubmit(): void {
    console.log('Form 8915-F Data:', this.form.value);
  }
}