import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8911',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8911.component.html',
  styleUrls: ['./form8911.component.css']
})
export class Form8911Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  refuelingCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Total cost of qualified property
      line7: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const cost = Number(val['line1']);
      const credit = cost * 0.30; // 2025 refueling property rate example (30%)
      
      this.form.patchValue({
          line7: credit
      }, { emitEvent: false });

      this.refuelingCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8911 Data:', this.form.value);
  }
}
