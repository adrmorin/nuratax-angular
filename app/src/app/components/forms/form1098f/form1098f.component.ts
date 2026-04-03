import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1098f',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1098f.component.html',
  styleUrl: './form1098f.component.css'
})
export class Form1098fComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    filerName: [''],
    filerTIN: [''],
    payerName: [''],
    payerTIN: [''],
    accountNum: [''],
    box1_totalAmount: [0],
    box2_violationAmount: [0],
    box3_restitutionAmount: [0],
    box4_complianceAmount: [0],
    box5_multiplePayers: [false],
    box6_multiplePayees: [false],
    box7_code: [''],
    box8_dateOfAgreement: ['']
  });

  onSubmit() {
    console.log('Form 1098-F Submitted', this.form.value);
  }
}
