import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form5884',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5884.component.html',
  styleUrls: ['./form5884.component.css']
})
export class Form5884Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  workOppCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      // Part I - Current Year Credit
      line1a: [0], // First-year wages of qualified veterans
      line1b: [0], // Second-year wages of qualified veterans 
      line2: [0],  // Multiply Line 1 by percentage
      line3: [0],  // Credit from partnerships/S-corps
      line4: [0]   // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line1a: number, line1b: number, line3: number
      });
    });
  }

  calculateValues(val: {
      line1a: number, line1b: number, line3: number
  }): void {
      const w1 = (Number(val.line1a) || 0) * 0.40;
      const w2 = (Number(val.line1b) || 0) * 0.25;
      const tentative = w1 + w2;
      const total = tentative + (Number(val.line3) || 0);

      this.form.patchValue({
          line2: tentative,
          line4: total
      }, { emitEvent: false });

      this.workOppCredit.set(total);
  }

  onSubmit(): void {
      console.log('Form 5884 Data:', this.form.value);
  }
}
