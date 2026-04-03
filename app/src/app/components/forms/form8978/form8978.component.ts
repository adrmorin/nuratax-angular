import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8978',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8978.component.html',
  styleUrls: ['./form8978.component.css']
})
export class Form8978Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalAdjustment = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      partnerName: [''],
      tin: [''],
      line1: [0], // Adjustment from Schedule K-1
      line2: [0]  // Total adjustment
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const adjustment = Number(val['line1']) || 0;
      this.form.patchValue({
          line2: adjustment
      }, { emitEvent: false });

      this.totalAdjustment.set(adjustment);
  }

  onSubmit(): void {
    console.log('Form 8978 Data:', this.form.value);
  }
}
