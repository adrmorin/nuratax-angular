import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8834',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8834.component.html',
  styleUrls: ['./form8834.component.css']
})
export class Form8834Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  evCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified electric vehicle cost
      line2: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const cost = Number(val['line1']);
      const credit = cost * 0.10; // 2025 electric vehicle rate example (10%)
      
      this.form.patchValue({
          line2: credit
      }, { emitEvent: false });

      this.evCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8834 Data:', this.form.value);
  }
}
