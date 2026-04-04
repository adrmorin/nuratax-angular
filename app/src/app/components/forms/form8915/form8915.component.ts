import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8915',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8915.component.html',
  styleUrls: ['./form8915.component.css']
})
export class Form8915Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  taxableDistribution = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      tin: [''],
      part1_totalDist: [0], // Total qualified disaster distributions
      part1_repayments: [0], // Total repayments made
      part1_taxableAmount: [0], // (Total Dist - Repayments) / 3 or full?
      spreadOver3Years: [true], // Option to spread tax over 3 years
      part2_reportedThisYear: [0] // Amount to report as income this year
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          part1_totalDist: number, 
          part1_repayments: number, 
          spreadOver3Years: boolean
      });
    });
  }

  calculateValues(val: {
      part1_totalDist: number, 
      part1_repayments: number, 
      spreadOver3Years: boolean
  }): void {
      const dist = Number(val.part1_totalDist) || 0;
      const repay = Number(val.part1_repayments) || 0;
      const net = Math.max(0, dist - repay);
      
      let thisYear = net;
      if (val.spreadOver3Years) {
          thisYear = net / 3;
      }

      this.form.patchValue({
          part1_taxableAmount: net,
          part2_reportedThisYear: thisYear
      }, { emitEvent: false });

      this.taxableDistribution.set(thisYear);
  }

  onSubmit(): void {
      console.log('Form 8915 Data:', this.form.value);
  }
}
