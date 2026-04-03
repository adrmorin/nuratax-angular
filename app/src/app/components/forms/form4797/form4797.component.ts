import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form4797',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4797.component.html',
  styleUrls: ['./form4797.component.css']
})
export class Form4797Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalGain1231 = signal(0);
  totalOrdinaryGain = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      // Part I - Section 1231
      p1Line2a: [0], // Gross sales price
      p1Line2b: [0], // Depreciation allowed
      p1Line2c: [0], // Cost or basis
      p1Line7: [0],  // Net gain/loss
      // Part II - Ordinary
      p2Line10: [0], // Ordinary gain/loss
      p2Line17: [0]  // Total ordinary gain
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const gain1231 = Number(val['p1Line2a']) + Number(val['p1Line2b']) - Number(val['p1Line2c']);
      this.totalGain1231.set(gain1231);
      
      this.form.patchValue({
          p1Line7: gain1231
      }, { emitEvent: false });

      this.totalOrdinaryGain.set(Number(val['p2Line10']) + Number(val['p2Line17']));
  }

  onSubmit(): void {
    console.log('Form 4797 Data:', this.form.value);
  }
}
