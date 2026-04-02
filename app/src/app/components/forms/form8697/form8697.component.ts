import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8697',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8697.component.html',
  styleUrls: ['./form8697.component.css']
})
export class Form8697Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      taxpayer_name: [''], taxpayer_tin: [''], taxpayer_addr: [''],
      filing_type: ['individual'],
      // Part I - Regular Method (Representative columns)
      p1_l1a: [''], p1_l1b: [''], p1_l1c: [''],
      p1_l2a: [''], p1_l2b: [''], p1_l2c: [''],
      // Refund fields
      routing_number: [''], account_number: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8697 (2025):', this.form.value);
  }
}