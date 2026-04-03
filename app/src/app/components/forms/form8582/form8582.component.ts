import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8582',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8582.component.html',
  styleUrls: ['./form8582.component.css']
})
export class Form8582Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  lossAllowed = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1a: [0], // Current year profit
      line1b: [0], // Current year loss
      line1c: [0], // Prior year unallowed loss
      line1d: [0], // Total (combine line 1a, 1b, and 1c)
      line2: [0]   // Special allowance for rental real estate
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const line1dTotal = Number(val['line1a']) + Number(val['line1b']) + Number(val['line1c']);
      const finalLoss = Math.abs(line1dTotal) > Number(val['line2']) ? Number(val['line2']) : Math.abs(line1dTotal);
      
      this.form.patchValue({
          line1d: line1dTotal,
          line6: finalLoss // Usually line 6 or similar for total allowed loss
      }, { emitEvent: false });

      this.lossAllowed.set(finalLoss);
  }

  onSubmit(): void {
    console.log('Form 8582 Data:', this.form.value);
  }
}
