import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8906',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8906.component.html',
  styleUrls: ['./form8906.component.css']
})
export class Form8906Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  spiritsCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of cases
      line2: [0.0250], // Average tax-financing cost per case (2024 approx)
      line3: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line2: number});
    });
  }

  calculateValues(val: {line1: number, line2: number}): void {
      const cases = Number(val['line1']) || 0;
      const costPerCase = Number(val['line2']) || 0.0250;
      const credit = cases * costPerCase;
      
      this.form.patchValue({
          line3: credit
      }, { emitEvent: false });

      this.spiritsCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8906 Data:', this.form.value);
  }
}
