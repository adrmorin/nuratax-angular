import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form4970',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4970.component.html',
  styleUrls: ['./form4970.component.css']
})
export class Form4970Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  partialTax = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Amount of accumulation distribution
      line2: [0], // Taxes imposed on trust
      line28: [0] // Partial tax
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const tax = Number(val['line1']) * 0.15; // Simplified 15% partial tax example
      
      this.form.patchValue({
          line28: tax
      }, { emitEvent: false });

      this.partialTax.set(tax);
  }

  onSubmit(): void {
    console.log('Form 4970 Data:', this.form.value);
  }
}
