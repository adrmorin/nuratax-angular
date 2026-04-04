import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8582cr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8582cr.component.html',
  styleUrls: ['./form8582cr.component.css']
})
export class Form8582CRComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  allowedCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      // Part I - Passive Activity Credits
      line1a: [0], // Post-1986 passive activity credits
      line1b: [0], // Pre-1987 passive activity credits 
      line2: [0],  // Total passive activity credits
      // Part II - Special Allowance for Rental Real Estate
      line3: [0],  // Credits from 8582, line 1a
      line4: [0],  // 25,000 threshold
      line5: [0]   // Allowed credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          line1a: number, line1b: number, line3: number
      });
    });
  }

  calculateValues(val: {
      line1a: number, line1b: number, line3: number
  }): void {
      const total = (Number(val.line1a) || 0) + (Number(val.line1b) || 0);
      const limit = 25000;
      
      const allowed = Math.min(total, limit);

      this.form.patchValue({
          line2: total,
          line4: limit,
          line5: allowed
      }, { emitEvent: false });

      this.allowedCredit.set(allowed);
  }

  onSubmit(): void {
      console.log('Form 8582-CR Data:', this.form.value);
  }
}
