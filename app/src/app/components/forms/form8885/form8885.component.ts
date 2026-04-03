import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8885',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8885.component.html',
  styleUrls: ['./form8885.component.css']
})
export class Form8885Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  healthCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line2: [0], // Total premiums paid
      line5: [0]  // Health coverage tax credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const premiums = Number(val['line2']);
      const credit = premiums * 0.725; // 72.5% credit example
      
      this.form.patchValue({
          line5: credit
      }, { emitEvent: false });

      this.healthCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8885 Data:', this.form.value);
  }
}
