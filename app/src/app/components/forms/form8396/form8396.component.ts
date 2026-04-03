import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8396',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8396.component.html',
  styleUrls: ['./form8396.component.css']
})
export class Form8396Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  currentYearCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Mortgage interest paid
      line2: [0], // Credit rate from MCC
      line3: [0], // Potential credit (multiply line 1 by line 2)
      line9: [0]  // Current year mortgage interest credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const rate = Number(val['line2']) / 100;
      const potential = Number(val['line1']) * rate;
      const finalCredit = Math.min(potential, 2000); // Cap usually at $2,000 for many MCCs
      
      this.form.patchValue({
          line3: potential,
          line9: finalCredit
      }, { emitEvent: false });

      this.currentYearCredit.set(finalCredit);
  }

  onSubmit(): void {
    console.log('Form 8396 Data:', this.form.value);
  }
}
