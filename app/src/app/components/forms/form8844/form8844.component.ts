import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8844',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8844.component.html',
  styleUrls: ['./form8844.component.css']
})
export class Form8844Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  empowermentCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified empowerment zone wages
      line2: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const wages = Number(val['line1']);
      const credit = wages * 0.20; // 2025 empowerment zone rate example (20%)
      
      this.form.patchValue({
          line2: credit
      }, { emitEvent: false });

      this.empowermentCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8844 Data:', this.form.value);
  }
}
