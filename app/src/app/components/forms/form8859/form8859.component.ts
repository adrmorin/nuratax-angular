import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8859',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8859.component.html',
  styleUrls: ['./form8859.component.css']
})
export class Form8859Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  homebuyerCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Carryforward of DC first-time homebuyer credit
      line3: [0]  // Credit allowed for current year
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const carryforward = Number(val['line1']);
      
      this.form.patchValue({
          line3: carryforward // Simple carryforward logic for example
      }, { emitEvent: false });

      this.homebuyerCredit.set(carryforward);
  }

  onSubmit(): void {
    console.log('Form 8859 Data:', this.form.value);
  }
}
