import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1098q',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1098q.component.html',
  styleUrl: './form1098q.component.css'
})
// Form 1098-Q - Qualifying Longevity Annuity Contract
export class Form1098qComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    issuerName: [''],
    issuerTIN: [''],
    annuitantName: [''],
    annuitantTIN: [''],
    accountNum: [''],
    box1a_annuityAmount: [0],
    box1b_dateStarts: [''],
    box2_isAccelerated: [false],
    box3_isIRA: [false],
    box4_fmv: [0],
    box5_totalPremiums: [0],
    box6_dateOfBirth: [''],
    box7_planName: [''],
    box8_planNum: ['']
  });

  onSubmit() {
    console.log('Form 1098-Q Submitted', this.form.value);
  }
}
