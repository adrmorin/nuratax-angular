import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form6478',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form6478.component.html',
  styleUrls: ['./form6478.component.css']
})
export class Form6478Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  biofuelCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of gallons
      line3: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const gallons = Number(val['line1']);
      const credit = gallons * 1.01; // 2025 biofuel rate example ($1.01 per gallon)
      
      this.form.patchValue({
          line3: credit
      }, { emitEvent: false });

      this.biofuelCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 6478 Data:', this.form.value);
  }
}
