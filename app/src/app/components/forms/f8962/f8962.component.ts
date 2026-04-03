import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-f8962',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './f8962.component.html',
  styleUrls: ['./f8962.component.css']
})
export class F8962Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  householdIncome = signal(0);
  percentageAllowed = signal(0);
  netPTC = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      exceptionBox: [false],
      line1: [0],  // Family size
      line2a: [0], // Modified AGI
      line2b: [0], // Dependents AGI
      line3: [0],  // Household income
      line4: ['states'], // Alaska, Hawaii, Other
      line4Amount: [0],  // FPL amount
      line5: [0],  // Income as % of FPL
      line7: [0],  // Applicable figure
      line8a: [0], // Annual contribution
      line8b: [0], // Monthly contribution
      line24: [0], // Total PTC allowed
      line25: [0], // Total APTC
      line26: [0]  // Net PTC (24-25)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string | boolean>): void {
      const income = Number(val['line2a']) + Number(val['line2b']);
      this.householdIncome.set(income);

      // Simple calculation bridge
      const fpt = Number(val['line4Amount']) || 1;
      const fplPct = (income / fpt) * 100;
      
      this.form.patchValue({
          line3: income,
          line5: Math.round(fplPct)
      }, { emitEvent: false });
  }

  onSubmit(): void {
    console.log('Form 8962 Data:', this.form.value);
  }
}
