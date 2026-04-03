import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form4972',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4972.component.html',
  styleUrls: ['./form4972.component.css']
})
export class Form4972Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  lumpSumTax = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line6: [0], // Capital gain part
      line8: [0], // Ordinary income part
      line30: [0] // Total tax
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const total = Number(val['line6']) + Number(val['line8']);
      const tax = total * 0.20; // Simplified 20% average tax example
      
      this.form.patchValue({
          line30: tax
      }, { emitEvent: false });

      this.lumpSumTax.set(tax);
  }

  onSubmit(): void {
    console.log('Form 4972 Data:', this.form.value);
  }
}
