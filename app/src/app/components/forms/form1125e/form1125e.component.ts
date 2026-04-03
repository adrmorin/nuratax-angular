import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form1125e',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1125e.component.html',
  styleUrls: ['./form1125e.component.css']
})
export class Form1125eComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalCompensation = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      officers: this.fb.array([
        this.createOfficer(),
        this.createOfficer()
      ]),
      line2: [0], // Total compensation
      line3: [0], // Compensation of officers claimed elsewhere
      line4: [0]  // Total (line 2 minus line 3)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  createOfficer(): FormGroup {
    return this.fb.group({
      name: [''],
      ssn: [''],
      percentTime: [0],
      percentCommon: [0],
      percentPreferred: [0],
      amount: [0]
    });
  }

  get officers(): FormArray {
    return this.form.get('officers') as FormArray;
  }

  calculateValues(val: { officers: { amount: number | string }[], line3: number | string }): void {
      const sum = val.officers.reduce((acc: number, off: { amount: number | string }) => acc + (Number(off.amount) || 0), 0);
      const total = sum - Number(val.line3);
      
      this.form.patchValue({
          line2: sum,
          line4: total
      }, { emitEvent: false });

      this.totalCompensation.set(total);
  }

  addOfficer(): void {
    this.officers.push(this.createOfficer());
  }

  onSubmit(): void {
    console.log('Form 1125-E Data:', this.form.value);
  }
}
