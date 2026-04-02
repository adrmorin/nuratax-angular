import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8621a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8621a.component.html',
  styleUrls: ['./form8621a.component.css']
})
export class Form8621aComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      shareholder_name: [''], shareholder_tin: [''], shareholder_addr: [''],
      shareholder_type: ['individual'],
      former_pfic_name: [''], former_pfic_ein: [''],
      // Part I Elections
      elect_a: [false], elect_b: [false], elect_c: [false], elect_d: [false],
      // Part II
      line1_date: [''], line2_year: [''], line3_amount: [''], line4_gain: [''],
      // Part III
      line5_date: [''], line6_year: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8621-A (2025):', this.form.value);
  }
}