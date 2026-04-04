import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8849',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8849.component.html',
  styleUrls: ['./form8849.component.css']
})
export class Form8849Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  totalRefund = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      // Part I - Claim Information
      claimAmount: [0], // Amount of refund claimed
      schedule1: [0], // Nontaxable Use of Fuels
      schedule2: [0], // Sales by Registered Ultimate Vendors
      schedule3: [0], // Certain Fuel Mixtures and the Alternative Fuel Credit
      schedule5: [0], // Section 4081(e) Claims
      schedule6: [0], // Other Claims
      schedule8: [0]  // Registered Credit Card Issuers
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          schedule1: number, schedule2: number, schedule3: number,
          schedule5: number, schedule6: number, schedule8: number
      });
    });
  }

  calculateValues(val: {
      schedule1: number, schedule2: number, schedule3: number,
      schedule5: number, schedule6: number, schedule8: number
  }): void {
      const total = (Number(val.schedule1) || 0) + (Number(val.schedule2) || 0) + 
                    (Number(val.schedule3) || 0) + (Number(val.schedule5) || 0) + 
                    (Number(val.schedule6) || 0) + (Number(val.schedule8) || 0);

      this.form.patchValue({
          claimAmount: total
      }, { emitEvent: false });

      this.totalRefund.set(total);
  }

  onSubmit(): void {
      console.log('Form 8849 Data:', this.form.value);
  }
}
