import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8864',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8864.component.html',
  styleUrls: ['./form8864.component.css']
})
export class Form8864Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  biodieselCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of gallons
      line9: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const gallons = Number(val['line1']);
      const credit = gallons * 1.00; // 2025 biodiesel rate example ($1.00 per gallon)
      
      this.form.patchValue({
          line9: credit
      }, { emitEvent: false });

      this.biodieselCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8864 Data:', this.form.value);
  }
}
