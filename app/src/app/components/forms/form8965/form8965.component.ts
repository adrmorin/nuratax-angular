import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8965',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8965.component.html',
  styleUrls: ['./form8965.component.css']
})
export class Form8965Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  exemptionCount = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      taxpayerName: [''],
      ssn: [''],
      exemptReason: [''], // code A, B, C, etc.
      fullYearExempt: [false]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      this.exemptionCount.set(val['fullYearExempt'] ? 1 : 0);
  }

  onSubmit(): void {
    console.log('Form 8965 Data:', this.form.value);
  }
}
