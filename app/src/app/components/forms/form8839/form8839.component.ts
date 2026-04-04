import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8839',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8839.component.html',
  styleUrls: ['./form8839.component.css']
})
export class Form8839Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  tentativeCredit = signal(0);
  finalAdoptionCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      childName: [''],
      line3: [16810], // Max credit per child (2024)
      line4: [0],     // Prior years credit
      line5: [16810], // Subtract line 4 from line 3
      line6: [0],     // Qualified expenses paid in 2024
      line11: [0],    // Smaller of 5 or 6 (Tentative Credit)
      
      // Part III - Phaseout
      line14: [0],    // Modified AGI (MAGI)
      line15: [252150], // Phaseout begins
      line16: [0],    // MAGI above threshold
      line17: [0],    // Phaseout fraction
      
      line23: [0]     // Final Adoption Credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line3: number, line4: number, line6: number, line14: number});
    });
  }

  calculateValues(val: {line3: number, line4: number, line6: number, line14: number}): void {
      const l3 = 16810; 
      const l4 = Number(val['line4']) || 0;
      const l5 = Math.max(0, l3 - l4);
      const l6 = Number(val['line6']) || 0;
      const tentative = Math.min(l5, l6);
      
      // Phaseout logic
      const magi = Number(val['line14']) || 0;
      const threshold = 252150;
      const diff = Math.max(0, magi - threshold);
      const fraction = Math.min(1, diff / 40000);
      const finalCredit = Math.max(0, tentative - (tentative * fraction));
      
      this.form.patchValue({
          line5: l5,
          line11: tentative,
          line16: diff,
          line17: fraction,
          line23: finalCredit
      }, { emitEvent: false });

      this.tentativeCredit.set(tentative);
      this.finalAdoptionCredit.set(finalCredit);
  }

  onSubmit(): void {
    console.log('Form 8839 Data:', this.form.value);
  }
}
