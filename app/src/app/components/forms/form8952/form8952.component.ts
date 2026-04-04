import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8952',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8952.component.html',
  styleUrls: ['./form8952.component.css']
})
export class Form8952Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  settlementPayment = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      taxpayerName: [''],
      ein: [''],
      // Part I - Eligibility
      totalWages: [0], // Wages paid to workers to be reclassified
      taxRate: [15.3], // Example self-employment/payroll rate
      // Part II - Payment Calculation
      vcspPayment: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          totalWages: number, taxRate: number
      });
    });
  }

  calculateValues(val: {
      totalWages: number, taxRate: number
  }): void {
      const wages = Number(val.totalWages) || 0;
      const rate = (Number(val.taxRate) || 0) / 100;
      
      // Official VCSP payment is roughly 10% of the tax due (simplified)
      const payment = wages * rate * 0.10;

      this.form.patchValue({
          vcspPayment: payment
      }, { emitEvent: false });

      this.settlementPayment.set(payment);
  }

  onSubmit(): void {
      console.log('Form 8952 Data:', this.form.value);
  }
}
