import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8912',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8912.component.html',
  styleUrls: ['./form8912.component.css']
})
export class Form8912Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalBondCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Credit from Form 1097-BTC
      line2: [0], // Bond credit from your own bonds
      line3: [0], // Carryforward of bond credits from prior years
      line4: [0], // Total credit (Sum lines 1-3)
      line5: [0]  // Allowed credit (tentative)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line2: number, line3: number});
    });
  }

  calculateValues(val: {line1: number, line2: number, line3: number}): void {
      const l1 = Number(val['line1']) || 0;
      const l2 = Number(val['line2']) || 0;
      const l3 = Number(val['line3']) || 0;
      const total = l1 + l2 + l3;
      
      this.form.patchValue({
          line4: total,
          line5: total
      }, { emitEvent: false });

      this.totalBondCredit.set(total);
  }

  onSubmit(): void {
    console.log('Form 8912 Data:', this.form.value);
  }
}
