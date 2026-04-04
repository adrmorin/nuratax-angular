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
  reasonSelected = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ptin: [''],
      reason1: [false], // Taxpayer chose to file on paper
      reason2: [false], // Preparer received waiver
      reason3: [false], // Preparer's software doesn't support the form
      reason4: [false], // Cannot file due to technical difficulties
      reason5: [false], // Other (describe below)
      explanation: ['']
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {reason1: boolean, reason2: boolean, reason3: boolean, reason4: boolean, reason5: boolean});
    });
  }

  calculateValues(val: {reason1: boolean, reason2: boolean, reason3: boolean, reason4: boolean, reason5: boolean}): void {
      const selected = val.reason1 || val.reason2 || val.reason3 || val.reason4 || val.reason5;
      this.reasonSelected.set(selected);
  }

  onSubmit(): void {
    console.log('Form 8948 Data:', this.form.value);
  }
}
