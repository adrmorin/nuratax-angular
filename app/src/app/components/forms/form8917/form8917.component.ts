import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8917',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8917.component.html',
  styleUrls: ['./form8917.component.css']
})
export class Form8917Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  tuitionDeduction = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Qualified expenses
      line4: [0], // Adjusted gross income
      line6: [0]  // Tuition and fees deduction
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const deduction = Math.min(Number(val['line1']), 4000); // 2025 max deduction example
      
      this.form.patchValue({
          line6: deduction
      }, { emitEvent: false });

      this.tuitionDeduction.set(deduction);
  }

  onSubmit(): void {
    console.log('Form 8917 Data:', this.form.value);
  }
}
