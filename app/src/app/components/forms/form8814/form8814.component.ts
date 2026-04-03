import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8814',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './f8814.component.html', // Fixed filename
  styleUrls: ['./form8814.component.css']
})
export class Form8814Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  childTaxableIncome = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1a: [0], // Taxable interest
      line2: [0], // Ordinary dividends
      line6: [0]  // Taxable income
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const taxable = Math.max(0, (Number(val['line1a']) + Number(val['line2'])) - 2500); // 2025 threshold example
      
      this.form.patchValue({
          line6: taxable
      }, { emitEvent: false });

      this.childTaxableIncome.set(taxable);
  }

  onSubmit(): void {
    console.log('Form 8814 Data:', this.form.value);
  }
}
