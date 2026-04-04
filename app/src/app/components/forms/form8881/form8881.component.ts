import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8881',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8881.component.html',
  styleUrls: ['./form8881.component.css']
})
export class Form8881Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  pensionCredit = signal(0);
  autoEnrollCredit = signal(0);
  totalCombinedCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      // Part I - Startup Costs
      p1_line1: [0], // Qualified startup costs
      p1_line2: [0], // 50% of line 1
      p1_line3: [500], // Minimum credit ($500)
      p1_line4: [0], // Tentative Part I credit
      p1_line5: [0], // Credits from partnerships
      p1_line7: [0], // Total Part I credit
      
      // Part III - Auto-Enrollment
      p3_line10: [0], // $500 per year for 3 years
      
      line15: [0] // Total Credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {p1_line1: number, p1_line5: number, p3_line10: number});
    });
  }

  calculateValues(val: {p1_line1: number, p1_line5: number, p3_line10: number}): void {
      const p1_l1 = Number(val['p1_line1']) || 0;
      const p1_l2 = p1_l1 * 0.50;
      
      // Part I Limit: Smaller of p1_l2 or max limit (often $5,000 for SECURE Act)
      const p1_l4 = Math.min(p1_l2, 5000); 
      const p1_l5 = Number(val['p1_line5']) || 0;
      const p1_l7 = p1_l4 + p1_l5;
      
      const p3_l10 = Number(val['p3_line10']) || 0;
      const total = p1_l7 + p3_l10;
      
      this.form.patchValue({
          p1_line2: p1_l2,
          p1_line4: p1_l4,
          p1_line7: p1_l7,
          line15: total
      }, { emitEvent: false });

      this.pensionCredit.set(p1_l7);
      this.autoEnrollCredit.set(p3_l10);
      this.totalCombinedCredit.set(total);
  }

  onSubmit(): void {
    console.log('Form 8881 Data:', this.form.value);
  }
}
