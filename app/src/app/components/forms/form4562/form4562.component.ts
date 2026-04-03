import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form4562',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4562.component.html',
  styleUrls: ['./form4562.component.css']
})
export class Form4562Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // Real-time calculation signals
  totalSec179 = signal(0);
  totalDepreciation = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      businessActivity: [''],
      // Part I - Section 179
      line1: [1160000], // Maximum dollar limitation
      line2: [0],        // Total cost of section 179 property
      line3: [2890000], // Threshold cost before reduction
      line4: [0],        // Reduction in limitation
      line5: [0],        // Dollar limitation for tax year
      line6: [0],        // List of property
      line12: [0],       // Sec 179 expense deduction
      // Part II - Special Depreciation Allowance
      line14: [0],
      // Part III - MACRS
      line17: [0],
      line19a: [0],
      line22: [0] // Total depreciation
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const reduction = Math.max(0, Number(val['line2']) - Number(val['line3']));
      const limitation = Math.max(0, Number(val['line1']) - reduction);
      
      this.form.patchValue({
          line4: reduction,
          line5: limitation
      }, { emitEvent: false });

      this.totalSec179.set(Math.min(limitation, Number(val['line12'])));
      this.totalDepreciation.set(Number(val['line14']) + Number(val['line17']) + Number(val['line22']));
  }

  onSubmit(): void {
    console.log('Form 4562 Data:', this.form.value);
  }
}
