import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8910',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8910.component.html',
  styleUrls: ['./form8910.component.css']
})
export class Form8910Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  altMotorCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''], // Using 'ein' for identifying number consistency
      line1: [0], // Tentative alternative motor vehicle credit
      line5: [0]  // Allowed credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {line1: number});
    });
  }

  calculateValues(val: {line1: number}): void {
      const tentative = Number(val['line1']) || 0;
      
      this.form.patchValue({
          line5: tentative
      }, { emitEvent: false });

      this.altMotorCredit.set(tentative);
  }

  onSubmit(): void {
    console.log('Form 8910 Data:', this.form.value);
  }
}
