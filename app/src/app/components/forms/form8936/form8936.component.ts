import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8936',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8936.component.html',
  styleUrls: ['./form8936.component.css']
})
export class Form8936Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  allowedCredit = signal(0);
  isEligibleByAgi = signal(true);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      filingStatus: ['mfj'],
      vehicleType: ['new'],
      agi: [0],
      line1: [0], // Tentative credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          filingStatus: string, vehicleType: string, agi: number, line1: number
      });
    });
  }

  calculateValues(val: {
      filingStatus: string, vehicleType: string, agi: number, line1: number
  }): void {
      const agi = Number(val.agi) || 0;
      let limit = 0;
      
      if (val.vehicleType === 'new') {
          if (val.filingStatus === 'mfj') limit = 300000;
          else if (val.filingStatus === 'hoh') limit = 225000;
          else limit = 150000;
      } else {
          if (val.filingStatus === 'mfj') limit = 150000;
          else if (val.filingStatus === 'hoh') limit = 112500;
          else limit = 75000;
      }

      const eligible = agi <= limit;
      this.isEligibleByAgi.set(eligible);
      
      const credit = eligible ? (Number(val.line1) || 0) : 0;
      this.allowedCredit.set(credit);
  }

  onSubmit(): void {
      console.log('Form 8936 Data:', this.form.value);
  }
}