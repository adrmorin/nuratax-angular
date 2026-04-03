import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form6252',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form6252.component.html',
  styleUrls: ['./form6252.component.css']
})
export class Form6252Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  installmentIncome = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [''], // Description of property
      line5: [0], // Selling price
      line6: [0], // Mortgages assumed
      line10: [0], // Gross profit percentage
      line21: [0], // Payments received
      line24: [0]  // Installment sale income
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const gpPercentage = Number(val['line10']) / 100;
      const income = Number(val['line21']) * gpPercentage;
      
      this.form.patchValue({
          line24: income
      }, { emitEvent: false });

      this.installmentIncome.set(income);
  }

  onSubmit(): void {
    console.log('Form 6252 Data:', this.form.value);
  }
}
