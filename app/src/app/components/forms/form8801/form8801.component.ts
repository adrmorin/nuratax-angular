import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8801',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8801.component.html',
  styleUrls: ['./form8801.component.css']
})
export class Form8801Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  minTaxCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      // Part I - Net Minimum Tax on Exclusion Items
      line1: [0], // Combined AMT line 1 and Schedule 2 (Form 1040)
      line2: [0], // Exclusion items
      line3: [0], // Modified taxable income (Line 1 + 2)
      // Part II - Minimum Tax Credit and Carryforward
      line24: [0], // Minimum tax credit
      line25: [0]  // Carryforward to next year
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line1: number, line2: number
      });
    });
  }

  calculateValues(val: {
      line1: number, line2: number
  }): void {
      const net = (Number(val.line1) || 0) + (Number(val.line2) || 0);

      this.form.patchValue({
          line3: net,
          line24: net * 0.10 // Placeholder logic for demonstration
      }, { emitEvent: false });

      this.minTaxCredit.set(net * 0.10);
  }

  onSubmit(): void {
      console.log('Form 8801 Data:', this.form.value);
  }
}
