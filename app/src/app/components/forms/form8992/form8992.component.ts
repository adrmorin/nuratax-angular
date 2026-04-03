import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8992',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8992.component.html',
  styleUrls: ['./form8992.component.css']
})
export class Form8992Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  giltiAmount = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      businessName: [''],
      ein: [''],
      netTestedIncome: [0],
      netDtir: [0] // Deemed Tangible Income Return
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      const income = Number(val['netTestedIncome']) || 0;
      const dtir = Number(val['netDtir']) || 0;
      
      this.giltiAmount.set(Math.max(0, income - dtir));
  }

  onSubmit(): void {
    console.log('Form 8992 Data:', this.form.value);
  }
}
