import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sk1-1065',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sk1-1065.component.html',
  styleUrls: ['./sk1-1065.component.css']
})
export class Sk11065Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  ordBusinessIncome = signal(0);
  netRentalIncome = signal(0);
  interestIncome = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      // Part I
      partnershipEIN: [''],
      partnershipName: [''],
      partnershipAddress: [''],
      irsCenter: [''],
      
      // Part II
      partnerID: [''],
      partnerName: [''],
      partnerAddress: [''],
      partnerType: ['general'], // general, limited, etc.
      entityType: ['individual'], // individual, corp, partnership, etc.
      domesticForeign: ['domestic'],
      
      // Part III
      line1: [0],  // Ordinary business income (loss)
      line2: [0],  // Net rental real estate income (loss)
      line3: [0],  // Other net rental income (loss)
      line4a: [0], // Guaranteed payments for services
      line4b: [0], // Guaranteed payments for capital
      line4c: [0], // Total guaranteed payments
      line5: [0],  // Interest income
      line6a: [0], // Ordinary dividends
      line6b: [0], // Qualified dividends
      line7: [0],  // Royalties
      line8: [0],  // Net short-term capital gain (loss)
      line9a: [0], // Net long-term capital gain (loss)
      line9b: [0], // Collectibles (28%) gain (loss)
      line9c: [0], // Unrecaptured section 1250 gain
      line10: [0], // Net section 1231 gain (loss)
      line11: [0], // Other income (loss)
      line12: [0], // Section 179 deduction
      line13: [0], // Other deductions
      line14: [0], // Self-employment earnings (loss)
      line15: [0], // Credits
      line16: [0], // International transactions
      line17: [0], // Alternative minimum tax (AMT) items
      line18: [0], // Tax-exempt income and nondeductible expenses
      line19: [0], // Distributions
      line20: [0]  // Other information
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
    this.ordBusinessIncome.set(Number(val['line1']));
    this.netRentalIncome.set(Number(val['line2']) + Number(val['line3']));
    this.interestIncome.set(Number(val['line5']));

    // Auto-update totals
    this.form.patchValue({
      line4c: Number(val['line4a']) + Number(val['line4b'])
    }, { emitEvent: false });
  }

  onSubmit(): void {
    console.log('Schedule K-1 Data:', this.form.value);
  }
}
