import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8912',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8912.component.html',
  styleUrls: ['./form8912.component.css']
})
export class Form8912Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  bondCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Credit from Form 1097-BTC
      line5: [0]  // Allowed credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const btc = Number(val['line1']);
      
      this.form.patchValue({
          line5: btc
      }, { emitEvent: false });

      this.bondCredit.set(btc);
  }

  onSubmit(): void {
    console.log('Form 8912 Data:', this.form.value);
  }
}
