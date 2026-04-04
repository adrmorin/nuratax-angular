import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8844',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8844.component.html',
  styleUrls: ['./form8844.component.css']
})
export class Form8844Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  empowermentCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Qualified empowerment zone wages
      line2: [0], // Line 1 * 20%
      line3: [0], // Credits from partnerships, S corps, etc.
      line4: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number, line3: number});
    });
  }

  calculateValues(val: {line1: number, line3: number}): void {
      const line1 = Number(val['line1']) || 0;
      const line2 = line1 * 0.20; 
      const line3 = Number(val['line3']) || 0;
      const line4 = line2 + line3;
      
      this.form.patchValue({
          line2: line2,
          line4: line4
      }, { emitEvent: false });

      this.empowermentCredit.set(line4);
  }

  onSubmit(): void {
    console.log('Form 8844 Data:', this.form.value);
  }
}
