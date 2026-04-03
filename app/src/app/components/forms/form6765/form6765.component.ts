import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form6765',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form6765.component.html',
  styleUrls: ['./form6765.component.css']
})
export class Form6765Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  researchCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Wages for qualified services
      line2: [0], // Cost of supplies
      line3: [0], // Rental/lease costs of computers
      line8: [0], // Total qualified research expenses
      line17: [0] // Regular credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const totalExpenses = Number(val['line1']) + Number(val['line2']) + Number(val['line3']);
      const credit = totalExpenses * 0.20; // 20% regular credit example
      
      this.form.patchValue({
          line8: totalExpenses,
          line17: credit
      }, { emitEvent: false });

      this.researchCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 6765 Data:', this.form.value);
  }
}
