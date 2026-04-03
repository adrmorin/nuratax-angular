import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8949',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8949.component.html',
  styleUrls: ['./form8949.component.css']
})
export class Form8949Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  netGainLoss = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1_proceeds: [0],
      line1_cost: [0],
      line1_gain_loss: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const proceeds = Number(val['line1_proceeds']);
      const cost = Number(val['line1_cost']);
      const gainLoss = proceeds - cost;
      
      this.form.patchValue({
          line1_gain_loss: gainLoss
      }, { emitEvent: false });

      this.netGainLoss.set(gainLoss);
  }

  onSubmit(): void {
    console.log('Form 8949 Data:', this.form.value);
  }
}
