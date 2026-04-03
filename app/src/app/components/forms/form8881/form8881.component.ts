import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8881',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8881.component.html',
  styleUrls: ['./form8881.component.css']
})
export class Form8881Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  pensionCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified startup costs
      line3: [0], // Credit for the current year
      line7: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const costs = Number(val['line1']);
      const credit = Math.min(costs * 0.50, 5000); // 2025 max startup benefit
      
      this.form.patchValue({
          line3: credit,
          line7: credit
      }, { emitEvent: false });

      this.pensionCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8881 Data:', this.form.value);
  }
}
