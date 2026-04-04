import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8834',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8834.component.html',
  styleUrls: ['./form8834.component.css']
})
export class Form8834Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  evCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      // Part I - Tentative Credit
      line1: [0], // Cost of qualified electric vehicle
      line2: [0], // Section 179 deduction
      line3: [0], // Subtract line 2 from line 1
      line4: [0], // Multiply line 3 by 10%
      line5: [0], // Maximum credit per vehicle ($4,000)
      line6: [0], // Lesser of line 4 or line 5
      // Part II - Credit Calculation
      line7: [0], // Form 8834 credit from partnerships/S-corps
      line8: [0]  // Total credit (Line 6 + 7)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line1: number, line2: number, line7: number
      });
    });
  }

  calculateValues(val: {
      line1: number, line2: number, line7: number
  }): void {
      const netCost = (Number(val.line1) || 0) - (Number(val.line2) || 0);
      const tentative = netCost * 0.10;
      const limit = 4000;
      const step6 = Math.min(tentative, limit);
      
      const total = step6 + (Number(val.line7) || 0);

      this.form.patchValue({
          line3: netCost,
          line4: tentative,
          line5: limit,
          line6: step6,
          line8: total
      }, { emitEvent: false });

      this.evCredit.set(total);
  }

  onSubmit(): void {
      console.log('Form 8834 Data:', this.form.value);
  }
}
