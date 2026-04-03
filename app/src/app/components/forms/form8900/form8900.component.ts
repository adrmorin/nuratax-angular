import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8900',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8900.component.html',
  styleUrls: ['./form8900.component.css']
})
export class Form8900Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  railroadCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified railroad track maintenance expenses
      line5: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const expenses = Number(val['line1']);
      const credit = expenses * 0.50; // 2025 railroad rate example (50%)
      
      this.form.patchValue({
          line5: credit
      }, { emitEvent: false });

      this.railroadCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8900 Data:', this.form.value);
  }
}
