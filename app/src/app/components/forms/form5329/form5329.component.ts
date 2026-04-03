import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form5329',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5329.component.html',
  styleUrls: ['./form5329.component.css']
})
export class Form5329Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  additionalTax = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Early distributions
      line2: [0], // Exceptions
      line4: [0]  // Result (Additional tax)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const taxable = Math.max(0, Number(val['line1']) - Number(val['line2']));
      const tax = taxable * 0.10; // Standard 10% early withdrawal tax
      
      this.form.patchValue({
          line4: tax
      }, { emitEvent: false });

      this.additionalTax.set(tax);
  }

  onSubmit(): void {
    console.log('Form 5329 Data:', this.form.value);
  }
}