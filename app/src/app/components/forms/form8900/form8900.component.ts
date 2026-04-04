import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8900',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8900.component.html',
  styleUrls: ['./form8900.component.css']
})
export class Form8900Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  railroadCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified railroad track maintenance expenses
      line2: [0], // 40% of line 1 (SECURE 2.0 / Tax Relief Act)
      line3: [0], // Number of miles of railroad track
      line4: [0], // Line 3 * $3,500 (limit)
      line5: [0]  // Smaller of line 2 or line 4
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line3: number});
    });
  }

  calculateValues(val: {line1: number, line3: number}): void {
      const expenses = Number(val['line1']) || 0;
      const tentative = expenses * 0.40; // 40% rate for 2024
      
      const miles = Number(val['line3']) || 0;
      const limit = miles * 3500;
      
      const finalCredit = Math.min(tentative, limit);
      
      this.form.patchValue({
          line2: tentative,
          line4: limit,
          line5: finalCredit
      }, { emitEvent: false });

      this.railroadCredit.set(finalCredit);
  }

  onSubmit(): void {
    console.log('Form 8900 Data:', this.form.value);
  }
}
