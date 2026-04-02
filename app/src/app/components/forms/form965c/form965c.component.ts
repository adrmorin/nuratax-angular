import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form965c',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form965c.component.html',
  styleUrls: ['./form965c.component.css']
})
export class Form965cComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      // Part I
      transferor_name: [''], transferor_tin: [''], transferor_addr: [''],
      // Part II
      transferee_name: [''], transferee_tin: [''], transferee_addr: [''],
      // Part III
      accel_event: ['liquidated'], event_date: [''], event_desc: [''],
      // Part IV
      unpaid_liability: [''], next_payment_date: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 965-C (2025):', this.form.value);
  }
}
