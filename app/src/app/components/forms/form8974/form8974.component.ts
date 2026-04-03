import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8974',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8974.component.html',
  styleUrls: ['./form8974.component.css']
})
export class Form8974Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  payrollCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: [''],
      ein: [''],
      line7: [0], // Research credit
      line11: [0] // Payroll credit amount (limited)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const researchCredit = Number(val['line7']) || 0;
      const limit = 250000;
      const credit = Math.min(researchCredit, limit);
      
      this.form.patchValue({
          line11: credit
      }, { emitEvent: false });

      this.payrollCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8974 Data:', this.form.value);
  }
}
