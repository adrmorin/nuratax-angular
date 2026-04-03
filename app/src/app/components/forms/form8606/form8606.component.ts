import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-form8606', // Fixed selector naming
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8606.component.html',
  styleUrls: ['./form8606.component.css']
})
export class Form8606Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  iraBasis = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Nondeductible contributions
      line2: [0], // Total basis
      line14: [0] // Final IRA basis
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const basis = Number(val['line1']) + Number(val['line2']);
      
      this.form.patchValue({
          line14: basis
      }, { emitEvent: false });

      this.iraBasis.set(basis);
  }

  onSubmit(): void {
    console.log('Form 8606 Data:', this.form.value);
  }
}