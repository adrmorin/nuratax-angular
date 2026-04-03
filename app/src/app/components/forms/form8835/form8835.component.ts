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
  renewableCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Kilowatt-hours of electricity sold
      line3: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const kwh = Number(val['line1']);
      const credit = kwh * 0.027; // 2025 renewable rate example (2.7 cents per kWh)
      
      this.form.patchValue({
          line3: credit
      }, { emitEvent: false });

      this.renewableCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8835 Data:', this.form.value);
  }
}
