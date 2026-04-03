import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8820',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8820.component.html',
  styleUrls: ['./form8820.component.css']
})
export class Form8820Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  orphanCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified clinical testing expenses
      line2: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const expenses = Number(val['line1']);
      const credit = expenses * 0.25; // 2025 orphan drug rate example (25%)
      
      this.form.patchValue({
          line2: credit
      }, { emitEvent: false });

      this.orphanCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8820 Data:', this.form.value);
  }
}
