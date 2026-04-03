import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8950',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8950.component.html',
  styleUrls: ['./form8950.component.css']
})
export class Form8950Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  userFee = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      planName: [''],
      planNumber: [''],
      planAssets: [0],
      feeAmount: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const assets = Number(val['planAssets']);
      
      // Typical VCP user fee logic (simplified for 2025 example)
      let fee = 1500;
      if (assets > 500000) fee = 3000;
      
      this.form.patchValue({
          feeAmount: fee
      }, { emitEvent: false });

      this.userFee.set(fee);
  }

  onSubmit(): void {
    console.log('Form 8950 Data:', this.form.value);
  }
}
