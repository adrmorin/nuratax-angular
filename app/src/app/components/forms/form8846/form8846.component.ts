import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8846',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8846.component.html',
  styleUrls: ['./form8846.component.css']
})
export class Form8846Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  tipsCredit = signal(0);
  isHighWage = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Total tips paid
      line2: [0], // Tips not creditable
      line3: [0], // Creditable tips (1 - 2)
      isHighWage: [false], // Checkbox for wages > $168.6k
      line4: [0], // 7.65% credit
      line5: [0], // Credit from partnerships/S-Corps
      line6: [0]  // Total Credit (4 + 5)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {name: string, ein: string, line1: number, line2: number, isHighWage: boolean, line5: number});
    });
  }

  calculateValues(val: {name: string, ein: string, line1: number, line2: number, isHighWage: boolean, line5: number}): void {
      const line1 = Number(val['line1']) || 0;
      const line2 = Number(val['line2']) || 0;
      const line3 = Math.max(0, line1 - line2);
      
      this.isHighWage.set(val['isHighWage']);
      
      const line4 = line3 * 0.0765;
      const line5 = Number(val['line5']) || 0;
      const line6 = line4 + line5;
      
      this.form.patchValue({
          line3: line3,
          line4: line4,
          line6: line6
      }, { emitEvent: false });

      this.tipsCredit.set(line6);
  }

  onSubmit(): void {
    console.log('Form 8846 Data:', this.form.value);
  }
}
