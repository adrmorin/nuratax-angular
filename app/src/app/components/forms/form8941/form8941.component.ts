import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8941',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8941.component.html',
  styleUrls: ['./form8941.component.css']
})
export class Form8941Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  healthInsuranceCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of FTEs
      line2: [0], // Average annual wages
      line12: [0] // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const ftes = Number(val['line1']);
      const wages = Number(val['line2']);
      
      // Simple credit logic for small employer health insurance
      const credit = (ftes < 25 && wages < 50000) ? 1000 : 0;
      
      this.form.patchValue({
          line12: credit
      }, { emitEvent: false });

      this.healthInsuranceCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8941 Data:', this.form.value);
  }
}
