import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form5498qa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5498qa.component.html',
  styleUrl: './form5498qa.component.css'
})
export class Form5498qaComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    issuerName: [''],
    issuerTIN: [''],
    beneficiaryName: [''],
    beneficiaryTIN: [''],
    accountNum: [''],
    box1_ableContrib: [0],
    box2_abaRollover: [0],
    box3_cumulativeCop: [false],
    box4_fmv: [0],
    box5_accountOpened: [false],
    box6_basisOfEligibility: ['']
  });

  onSubmit() {
    console.log('Form 5498-QA Submitted', this.form.value);
  }
}
