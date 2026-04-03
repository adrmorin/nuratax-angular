import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8845',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8845.component.html',
  styleUrls: ['./form8845.component.css']
})
export class Form8845Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  indianCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Total qualified wages and health costs
      line4: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const wages = Number(val['line1']);
      const credit = wages * 0.20; // 2025 Indian employment rate example (20%)
      
      this.form.patchValue({
          line4: credit
      }, { emitEvent: false });

      this.indianCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8845 Data:', this.form.value);
  }
}
