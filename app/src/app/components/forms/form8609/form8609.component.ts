import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8609',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8609.component.html',
  styleUrls: ['./form8609.component.css']
})
export class Form8609Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  allocatedCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      address: [''],
      bin: [''], // Building Identification Number
      line1a: [0], // Eligible basis
      line1b: [0], // Low-income portion
      line2: [0]   // Maximum applicable credit percentage
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const qualifiedBasis = Number(val['line1a']) * (Number(val['line1b']) / 100);
      const credit = qualifiedBasis * (Number(val['line2']) / 100);
      
      this.allocatedCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8609 Data:', this.form.value);
  }
}