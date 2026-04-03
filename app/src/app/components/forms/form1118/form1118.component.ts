import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form1118',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1118.component.html',
  styleUrls: ['./form1118.component.css']
})
export class Form1118Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  corpForeignTaxCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      corpName: [''],
      ein: [''],
      line1: [0], // Foreign taxes paid
      line5: [0], // Total foreign tax credit
      line8: [0]  // Carryover adjustments
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const credit = Number(val['line1']) + Number(val['line8']);
      
      this.form.patchValue({
          line5: credit
      }, { emitEvent: false });

      this.corpForeignTaxCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 1118 Data:', this.form.value);
  }
}
