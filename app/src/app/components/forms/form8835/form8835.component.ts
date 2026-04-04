import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8835',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8835.component.html',
  styleUrls: ['./form8835.component.css']
})
export class Form8835Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  productionCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Kilowatt-hours of electricity sold (Line 1a + 1b)
      line2: [0.029], // 2024 rate (approx 2.9 cents per kWh)
      line3: [0], // Line 1 * Line 2
      line4: [0], // Credits from passthrough entities
      line5: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line2: number, line4: number});
    });
  }

  calculateValues(val: {line1: number, line2: number, line4: number}): void {
      const kwh = Number(val['line1']) || 0;
      const rate = Number(val['line2']) || 0.029;
      const l4 = Number(val['line4']) || 0;
      
      const product = kwh * rate;
      const total = product + l4;
      
      this.form.patchValue({
          line3: product,
          line5: total
      }, { emitEvent: false });

      this.productionCredit.set(total);
  }

  onSubmit(): void {
    console.log('Form 8835 Data:', this.form.value);
  }
}
