import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8933',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8933.component.html',
  styleUrls: ['./form8933.component.css']
})
export class Form8933Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  sequestrationCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      // Part I - Carbon Oxide Data
      qtyCaptured: [0], // Metric tons of carbon oxide
      creditRate: [85], // Default rate (e.g., $85 per ton for sequestration)
      // Part II - Credit Calculation
      tentativeCredit: [0],
      partnerCredit: [0], // Credit from partnerships/S-corps
      totalCredit: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          qtyCaptured: number, creditRate: number, partnerCredit: number
      });
    });
  }

  calculateValues(val: {
      qtyCaptured: number, creditRate: number, partnerCredit: number
  }): void {
      const tentative = (Number(val.qtyCaptured) || 0) * (Number(val.creditRate) || 0);
      const total = tentative + (Number(val.partnerCredit) || 0);

      this.form.patchValue({
          tentativeCredit: tentative,
          totalCredit: total
      }, { emitEvent: false });

      this.sequestrationCredit.set(total);
  }

  onSubmit(): void {
      console.log('Form 8933 Data:', this.form.value);
  }
}
