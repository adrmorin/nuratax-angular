import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8824',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8824.component.html',
  styleUrls: ['./form8824.component.css']
})
export class Form8824Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  realizedGain = signal(0);
  recognizedGain = signal(0);
  basisReceived = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line12: [0], // Adjusted basis of like-kind property given up
      line13: [0], // Cash received
      line14: [0], // FMV of other property received
      line15: [0], // Sum of lines 13 and 14
      line16: [0], // FMV of like-kind property received
      line17: [0], // Sum of lines 15 and 16
      line18: [0], // Adjusted basis + exchange expenses
      line19: [0], // Realized gain (17 - 18)
      line20: [0], // Recognized gain (smaller of 15 or 19)
      line25: [0]  // Basis of like-kind property received
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line12: number, line13: number, line14: number, line16: number, line18: number});
    });
  }

  calculateValues(val: {line12: number, line13: number, line14: number, line16: number, line18: number}): void {
      const l13 = Number(val['line13']) || 0;
      const l14 = Number(val['line14']) || 0;
      const l15 = l13 + l14;
      const l16 = Number(val['line16']) || 0;
      const l17 = l15 + l16;
      const l18 = Number(val['line18']) || 0;
      const l19 = Math.max(0, l17 - l18);
      const l20 = Math.max(0, Math.min(l15, l19));
      
      // Line 25: Basis of like-kind property received
      // Calculation: Line 18 - line 15 + line 20
      const l25 = l18 - l15 + l20;
      
      this.form.patchValue({
          line15: l15,
          line17: l17,
          line19: l19,
          line20: l20,
          line25: l25
      }, { emitEvent: false });

      this.realizedGain.set(l19);
      this.recognizedGain.set(l20);
      this.basisReceived.set(l25);
  }

  onSubmit(): void {
    console.log('Form 8824 Data:', this.form.value);
  }
}
