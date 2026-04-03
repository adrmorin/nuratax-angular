import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8609a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8609a.component.html',
  styleUrls: ['./form8609a.component.css']
})
export class Form8609aComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  annualCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      buildingAddress: [''],
      bin: [''],
      line7: [0], // Qualified basis
      line8: [0], // Applicable percentage
      line15: [0] // Current year credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const credit = Number(val['line7']) * (Number(val['line8']) / 100);
      
      this.form.patchValue({
          line15: credit
      }, { emitEvent: false });

      this.annualCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8609-A Data:', this.form.value);
  }
}