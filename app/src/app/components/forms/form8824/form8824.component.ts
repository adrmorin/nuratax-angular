import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8824',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8824.component.html',
  styleUrls: ['./form8824.component.css']
})
export class Form8824Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  realizedGain = signal(0);
  recognizedGain = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line12: [0], // Adjusted basis of like-kind property given up
      line15: [0], // Cash received
      line16: [0], // FMV of like-kind property received
      line19: [0], // Realized gain
      line20: [0], // Smaller of basis or money received
      line25: [0]  // Recognized gain
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const realized = (Number(val['line15']) + Number(val['line16'])) - Number(val['line12']);
      const recognized = Math.max(0, Math.min(realized, Number(val['line15']))); // Simplified for boot
      
      this.form.patchValue({
          line19: realized,
          line25: recognized
      }, { emitEvent: false });

      this.realizedGain.set(realized);
      this.recognizedGain.set(recognized);
  }

  onSubmit(): void {
    console.log('Form 8824 Data:', this.form.value);
  }
}
