import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1096',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1096.component.html',
  styleUrl: './form1096.component.css'
})
export class Form1096Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    filerName: [''],
    filerAddress: [''],
    contactName: [''],
    contactPhone: [''],
    contactEmail: [''],
    box1_ein: [''],
    box2_ssn: [''],
    box3_totalForms: [0],
    box4_federalTaxWithheld: [0],
    box5_totalAmountReported: [0],
    box6_checkedFormType: [''] // To select which form they are transmitting (e.g. 1099-INT, 1098, 5498)
  });

  onSubmit() {
    console.log('Form 1096 Submitted', this.form.value);
  }
}
