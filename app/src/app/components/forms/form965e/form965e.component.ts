import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form965e',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form965e.component.html',
  styleUrls: ['./form965e.component.css']
})
export class Form965eComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      // Part I
      shareholder_name: [''], shareholder_tin: [''], shareholder_addr: [''],
      // Part II
      scorp_name: [''], scorp_tin: [''],
      // Part III
      event_date: [''], event_desc: [''],
      // Part IV
      unpaid_965i_liability: [''], next_install_date: [''],
      // Part V
      able_to_pay: [true], leverage_exceeded: [false], addl_info: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 965-E (2025):', this.form.value);
  }
}
