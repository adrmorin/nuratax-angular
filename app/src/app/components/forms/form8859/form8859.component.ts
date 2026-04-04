import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8859',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8859.component.html',
  styleUrls: ['./form8859.component.css']
})
export class Form8859Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  currentCredit = signal(0);
  carryforwardNextYear = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Credit carryforward from prior years
      line2: [0], // Tax liability limit
      line3: [0], // Current year credit (Smaller of 1 or 2)
      line4: [0]  // Carryforward to 2025 (1 minus 3)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line2: number});
    });
  }

  calculateValues(val: {line1: number, line2: number}): void {
      const carryIn = Number(val['line1']) || 0;
      const taxLimit = Number(val['line2']) || 0;
      
      const allowed = Math.min(carryIn, taxLimit);
      const carryOut = Math.max(0, carryIn - allowed);
      
      this.form.patchValue({
          line3: allowed,
          line4: carryOut
      }, { emitEvent: false });

      this.currentCredit.set(allowed);
      this.carryforwardNextYear.set(carryOut);
  }

  onSubmit(): void {
    console.log('Form 8859 Data:', this.form.value);
  }
}
