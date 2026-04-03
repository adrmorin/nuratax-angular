import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8906',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8906.component.html',
  styleUrls: ['./form8906.component.css']
})
export class Form8906Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  spiritsCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of cases
      line3: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const cases = Number(val['line1']);
      const credit = cases * 0.05; // 2025 spirits rate example ($0.05 per case)
      
      this.form.patchValue({
          line3: credit
      }, { emitEvent: false });

      this.spiritsCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8906 Data:', this.form.value);
  }
}
