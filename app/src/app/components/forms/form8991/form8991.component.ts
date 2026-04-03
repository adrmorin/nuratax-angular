import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8991',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8991.component.html',
  styleUrls: ['./form8991.component.css']
})
export class Form8991Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  beatLiability = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: [''],
      ein: [''],
      regularTax: [0],
      modifiedTaxableIncome: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const regTax = Number(val['regularTax']) || 0;
      const modTaxIncome = Number(val['modifiedTaxableIncome']) || 0;
      
      const beatPercent = 0.10; // 10% BEAT tax
      const beatBase = modTaxIncome * beatPercent;
      
      this.beatLiability.set(Math.max(0, beatBase - regTax));
  }

  onSubmit(): void {
    console.log('Form 8991 Data:', this.form.value);
  }
}
