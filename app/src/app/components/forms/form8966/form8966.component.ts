import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8966',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8966.component.html',
  styleUrls: ['./form8966.component.css']
})
export class Form8966Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalBalance = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      ffiName: [''],
      giin: [''],
      accountBalance: [0],
      accountCurrency: ['USD']
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, any>): void {
      this.totalBalance.set(Number(val['accountBalance']) || 0);
  }

  onSubmit(): void {
    console.log('Form 8966 Data:', this.form.value);
  }
}
