import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8833',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8833.component.html',
  styleUrls: ['./form8833.component.css']
})
export class Form8833Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      taxpayer_name: [''], taxpayer_tin: [''], reference_id: [''],
      addr_foreign: [''], addr_us: [''],
      // Part I
      elect_6114: [false], elect_7701: [false], elect_us_cit: [false],
      // Part II
      treaty_country: [''], treaty_article: [''],
      irc_provisions: [''],
      payor_name: [''], payor_tin: [''], payor_addr: [''],
      lob_article: [''],
      reporting_req: [false],
      explanation: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8833 (2025):', this.form.value);
  }
}
