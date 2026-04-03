import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8936',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8936.component.html',
  styleUrls: ['./form8936.component.css']
})
export class Form8936Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  cleanVehicleCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Tentative clean vehicle credit
      line15: [0] // Credit allowed
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const tentative = Number(val['line1']);
      
      this.form.patchValue({
          line15: tentative
      }, { emitEvent: false });

      this.cleanVehicleCredit.set(tentative);
  }

  onSubmit(): void {
    console.log('Form 8936 Data:', this.form.value);
  }
}