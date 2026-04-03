import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8948',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8948.component.html',
  styleUrls: ['./form8948.component.css']
})
export class Form8948Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  waiverReasonSelected = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      preparerName: [''],
      ptin: [''],
      reason1: [false], // Undue hardship
      reason2: [false], // Technical limitations
      reason3: [false]  // Other
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const selected = !!(val['reason1'] || val['reason2'] || val['reason3']);
      this.waiverReasonSelected.set(selected);
  }

  onSubmit(): void {
    console.log('Form 8948 Data:', this.form.value);
  }
}
