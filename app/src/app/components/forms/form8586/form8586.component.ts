import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8586',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8586.component.html',
  styleUrls: ['./form8586.component.css']
})
export class Form8586Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  currentYearCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Number of Forms 8609-A attached
      line2: [0], // Total housing credit from attached Forms 8609-A
      line3: [0], // Total credit from pass-through entities
      line4: [0]  // Total (line 2 plus line 3)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const total = Number(val['line2']) + Number(val['line3']);
      
      this.form.patchValue({
          line4: total
      }, { emitEvent: false });

      this.currentYearCredit.set(total);
  }

  onSubmit(): void {
    console.log('Form 8586 Data:', this.form.value);
  }
}