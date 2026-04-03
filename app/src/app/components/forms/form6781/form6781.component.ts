import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form6781',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form6781.component.html',
  styleUrls: ['./form6781.component.css']
})
export class Form6781Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  net1256Gain = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // Net gain or loss from Form(s) 1099-B
      line2: [0], // Add lines 1 through 3
      line6: [0]  // Net gain or loss (combine line 2 with adjustments)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const net = Number(val['line1']);
      
      this.form.patchValue({
          line2: net,
          line6: net
      }, { emitEvent: false });

      this.net1256Gain.set(net);
  }

  onSubmit(): void {
    console.log('Form 6781 Data:', this.form.value);
  }
}
