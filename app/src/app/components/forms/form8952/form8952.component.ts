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
  
  // High-fidelity calculation signals
  settlementPayment = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      taxpayerName: [''],
      ein: [''],
      line20: [0], // Compensation paid
      line21: [0]  // Settlement amount
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const compensation = Number(val['line20']);
      const settlement = compensation * 0.01; // VCSP typical settlement rate example (1%)
      
      this.form.patchValue({
          line21: settlement
      }, { emitEvent: false });

      this.settlementPayment.set(settlement);
  }

  onSubmit(): void {
    console.log('Form 8952 Data:', this.form.value);
  }
}
