import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8815',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8815.component.html',
  styleUrls: ['./form8815.component.css']
})
export class Form8815Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  excludableInterest = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Total proceeds from Series EE and I
      line2: [0], // Face amount
      line14: [0] // Excludable interest
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const exclusion = Math.max(0, Number(val['line1']) - Number(val['line2']));
      
      this.form.patchValue({
          line14: exclusion
      }, { emitEvent: false });

      this.excludableInterest.set(exclusion);
  }

  onSubmit(): void {
    console.log('Form 8815 Data:', this.form.value);
  }
}
