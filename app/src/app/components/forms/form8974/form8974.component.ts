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
  
  payrollCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: [''],
      ein: [''],
      // Part I - Qualified Small Business Payroll Tax Credit
      line1: [''], // Tax period ending
      line7: [0], // Amount from 6765, line 44
      line8: [0], // Credit from 8974, line 12 (previous year?) 
      line9: [0], // Total credit (Line 7 + 8)
      line11: [0], // Current period credit
      line12: [0]  // Credit carryforward
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line7: number, line8: number, line11: number
      });
    });
  }

  calculateValues(val: {
      line7: number, line8: number, line11: number
  }): void {
      const line7 = Number(val.line7) || 0;
      const line8 = Number(val.line8) || 0;
      const total = line7 + line8;
      
      const current = Number(val.line11) || 0;
      const carry = Math.max(0, total - current);

      this.form.patchValue({
          line9: total,
          line12: carry
      }, { emitEvent: false });

      this.payrollCredit.set(current);
  }

  onSubmit(): void {
      console.log('Form 8974 Data:', this.form.value);
  }
}
