import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8936',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8936.component.html',
  styleUrls: ['./form8936.component.css']
})
export class Form8936Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  allowedCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      agi: [0],
      filingStatus: ['single'],
      vehicleType: ['new'], // new or used
      vin: [''],
      line1: [0], // Amount of credit from Schedule A (Form 8936)
      line15: [0] // Credit allowed after AGI limitations
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {agi: number, filingStatus: string, vehicleType: string, line1: number});
    });
  }

  calculateValues(val: {agi: number, filingStatus: string, vehicleType: string, line1: number}): void {
      const agi = Number(val.agi) || 0;
      const status = val.filingStatus;
      const type = val.vehicleType;
      const creditAmount = Number(val.line1) || 0;
      
      let credit = creditAmount;

      // New Vehicle Limits ($300k / $225k / $150k)
      if (type === 'new') {
          const limit = status === 'mfj' ? 300000 : status === 'hoh' ? 225000 : 150000;
          if (agi > limit) credit = 0;
      } 
      // Used Vehicle Limits ($150k / $112.5k / $75k)
      else if (type === 'used') {
          const limit = status === 'mfj' ? 150000 : status === 'hoh' ? 112500 : 75000;
          if (agi > limit) credit = 0;
      }

      this.form.patchValue({
          line15: credit
      }, { emitEvent: false });

      this.allowedCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8936 Data:', this.form.value);
  }
}