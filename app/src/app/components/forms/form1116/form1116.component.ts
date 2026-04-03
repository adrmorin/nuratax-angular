import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form1116',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1116.component.html',
  styleUrls: ['./form1116.component.css']
})
export class Form1116Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  foreignTaxCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line7: [0], // Foreign taxes paid
      line14: [0], // Tentative credit
      line24: [0]  // Final foreign tax credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const credit = Number(val['line7']);
      
      this.form.patchValue({
          line24: credit
      }, { emitEvent: false });

      this.foreignTaxCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 1116 Data:', this.form.value);
  }
}
