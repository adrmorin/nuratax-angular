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

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Tips on which social security/medicare taxes were paid
      line4: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const tips = Number(val['line1']);
      const credit = tips * 0.0765; // 2025 FICA tip rate example (7.65%)
      
      this.form.patchValue({
          line4: credit
      }, { emitEvent: false });

      this.tipsCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8846 Data:', this.form.value);
  }
}
