import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form5498',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5498.component.html',
  styleUrl: './form5498.component.css'
})
export class Form5498Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    issuerName: [''],
    issuerTIN: [''],
    participantName: [''],
    participantTIN: [''],
    accountNum: [''],
    box1_iraContrib: [0],
    box2_rolloverContrib: [0],
    box3_rothConversion: [0],
    box4_recharacterized: [0],
    box5_fmv: [0],
    box6_lifeInsuranceCost: [0],
    box7_isIRA: [false],
    box7_isSEP: [false],
    box7_isSIMPLE: [false],
    box7_isRothIRA: [false],
    box8_sepContrib: [0],
    box9_simpleContrib: [0],
    box10_rothContrib: [0],
    box11_rmdNextYear: [false],
    box12a_rmdDate: [''],
    box12b_rmdAmount: [0],
    box13a_postponedContrib: [0],
    box13b_year: [''],
    box13c_code: [''],
    box14a_repayments: [0],
    box14b_code: [''],
    box15a_fmvSpecifiedAssets: [0],
    box15b_codes: ['']
  });

  onSubmit() {
    console.log('Form 5498 Submitted', this.form.value);
  }
}
