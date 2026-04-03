import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form1125a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1125a.component.html',
  styleUrls: ['./form1125a.component.css']
})
export class Form1125aComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  costOfGoodsSold = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      identificationNumber: [''],
      line1: [0], // Inventory at beginning of year
      line2: [0], // Purchases
      line3: [0], // Cost of labor
      line4: [0], // Additional section 263A costs
      line5: [0], // Other costs
      line6: [0], // Total (add lines 1-5)
      line7: [0], // Inventory at end of year
      line8: [0]  // COGS (subtract line 7 from line 6)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const totalCost = Number(val['line1']) + Number(val['line2']) + Number(val['line3']) + Number(val['line4']) + Number(val['line5']);
      const cogs = totalCost - Number(val['line7']);
      
      this.form.patchValue({
          line6: totalCost,
          line8: cogs
      }, { emitEvent: false });

      this.costOfGoodsSold.set(cogs);
  }

  onSubmit(): void {
    console.log('Form 1125-A Data:', this.form.value);
  }
}
