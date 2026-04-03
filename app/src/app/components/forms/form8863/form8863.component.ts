import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8863',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8863.component.html',
  styleUrls: ['./form8863.component.css']
})
export class Form8863Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalEducationCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      line1: [0], // American Opportunity Credit (Part I)
      line10: [0], // Lifetime Learning Credit (Part II)
      line19: [0]  // Total education credits (Part III)
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const total = Number(val['line1']) + Number(val['line10']);
      
      this.form.patchValue({
          line19: total
      }, { emitEvent: false });

      this.totalEducationCredit.set(total);
  }

  onSubmit(): void {
    console.log('Form 8863 Data:', this.form.value);
  }
}
