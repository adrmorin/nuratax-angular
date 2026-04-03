import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8990',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8990.component.html',
  styleUrls: ['./form8990.component.css']
})
export class Form8990Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  interestLimit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: [''],
      ein: [''],
      ati: [0], // Adjusted Taxable Income
      businessInterestIncome: [0],
      statutoryLimitPct: [30] // 30% limitation
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const ati = Number(val['ati']) || 0;
      const interestIncome = Number(val['businessInterestIncome']) || 0;
      const pct = Number(val['statutoryLimitPct']) / 100;
      
      const limit = interestIncome + (ati * pct);
      this.interestLimit.set(limit);
  }

  onSubmit(): void {
    console.log('Form 8990 Data:', this.form.value);
  }
}
