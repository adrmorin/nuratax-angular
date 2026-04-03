import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form6251',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form6251.component.html',
  styleUrls: ['./form6251.component.css']
})
export class Form6251Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  amtIncome = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Taxable income from Form 1040
      line2a: [0], // Standard deduction
      line2b: [0], // Taxes from Schedule A
      line4: [0]  // Alternative minimum taxable income
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const amti = Number(val['line1']) + Number(val['line2a']) + Number(val['line2b']);
      
      this.form.patchValue({
          line4: amti
      }, { emitEvent: false });

      this.amtIncome.set(amti);
  }

  onSubmit(): void {
    console.log('Form 6251 Data:', this.form.value);
  }
}
