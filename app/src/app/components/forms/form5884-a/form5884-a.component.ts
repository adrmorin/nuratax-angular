import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form5884-a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5884-a.component.html',
  styleUrls: ['./form5884-a.component.css']
})
export class Form5884AComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  disasterCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified wages
      line2: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const wages = Number(val['line1']);
      const credit = wages * 0.40; // 2025 disaster wage rate example (40%)
      
      this.form.patchValue({
          line2: credit
      }, { emitEvent: false });

      this.disasterCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 5884-A Data:', this.form.value);
  }
}
