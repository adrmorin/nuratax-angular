import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8839',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8839.component.html',
  styleUrls: ['./form8839.component.css']
})
export class Form8839Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  adoptionCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // First name of child
      line5: [0], // Maximum credit
      line12: [0] // Adoption credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const maxCredit = 15950; // 2025 max credit example
      const credit = Math.min(Number(val['line5']), maxCredit);
      
      this.form.patchValue({
          line12: credit
      }, { emitEvent: false });

      this.adoptionCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8839 Data:', this.form.value);
  }
}
