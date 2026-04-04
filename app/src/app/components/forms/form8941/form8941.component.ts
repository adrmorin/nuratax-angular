import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8941',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8941.component.html',
  styleUrls: ['./form8941.component.css']
})
export class Form8941Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  tentativeCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of FTEs
      line2: [0], // Average annual wages
      line3: [0], // Total premiums paid
      line4: [0], // Line 3 * 50% (Taxable)
      line12: [0] // Allowed credit amount
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line2: number, line3: number});
    });
  }

  calculateValues(val: {line1: number, line2: number, line3: number}): void {
      const ftes = Number(val['line1']) || 0;
      const wages = Number(val['line2']) || 0;
      const premiums = Number(val['line3']) || 0;
      
      // Maximum credit is 50% of premiums paid
      let credit = premiums * 0.50;
      
      // Phaseout if FTEs > 10
      if (ftes > 10) {
          const reduction = (ftes - 10) / 15;
          credit -= (credit * reduction);
      }
      
      // Phaseout if wages > $30,700 (2024 threshold approx)
      const wageThreshold = 30700;
      if (wages > wageThreshold) {
          const reduction = (wages - wageThreshold) / wageThreshold;
          credit -= (credit * reduction);
      }

      const finalCredit = Math.max(0, credit);
      
      this.form.patchValue({
          line4: premiums * 0.50,
          line12: finalCredit
      }, { emitEvent: false });

      this.tentativeCredit.set(finalCredit);
  }

  onSubmit(): void {
    console.log('Form 8941 Data:', this.form.value);
  }
}
