import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1099da',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099da.component.html',
  styleUrl: './form1099da.component.css'
})
export class Form1099daComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    brokerName: [''],
    brokerTIN: [''],
    payeeName: [''],
    payeeTIN: [''],
    accountNum: [''],
    digitalAssetType: [''], // Box 1a Description
    box1b_dateAcquired: [''],
    box1c_dateSold: [''],
    box1d_proceeds: [0],
    box1e_costBasis: [0],
    box1f_washSaleLoss: [0],
    box2_federalTaxWithheld: [0]
  });

  onSubmit() {
    console.log('Form 1099-DA Submitted', this.form.value);
  }
}
