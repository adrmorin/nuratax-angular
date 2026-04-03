import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1099oid',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099oid.component.html',
  styleUrl: './form1099oid.component.css'
})
export class Form1099oidComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    payerName: [''],
    payerTIN: [''],
    payeeName: [''],
    payeeTIN: [''],
    accountNum: [''],
    box1_oid: [0],
    box2_otherPeriodicInterest: [0],
    box3_earlyWithdrawalPenalty: [0],
    box4_federalTaxWithheld: [0],
    box5_marketDiscount: [0],
    box6_acquisitionPremium: [0],
    box7_description: [''],
    box8_oidOnTreasury: [0],
    box9_investmentExpenses: [0],
    box10_bondPremium: [0],
    box11_taxExemptOid: [0],
    box12_stateName: [''], // State info 
    box13_stateId: [''],
    box14_stateTaxWithheld: [0]
  });

  onSubmit() {
    console.log('Form 1099-OID Submitted', this.form.value);
  }
}
