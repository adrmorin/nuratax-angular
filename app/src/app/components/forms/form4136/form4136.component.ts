import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form4136',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4136.component.html',
  styleUrls: ['./form4136.component.css']
})
export class Form4136Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  fuelCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Gasoline
      line2: [0], // Aviation gasoline
      line17: [0] // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const total = Number(val['line1']) + Number(val['line2']);
      
      this.form.patchValue({
          line17: total
      }, { emitEvent: false });

      this.fuelCredit.set(total);
  }

  onSubmit(): void {
    console.log('Form 4136 Data:', this.form.value);
  }
}
