import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-formw2g',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formw2g.component.html',
  styleUrl: './formw2g.component.css'
})
export class FormW2gComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    payerName: [''],
    payerTIN: [''],
    winnerName: [''],
    winnerTIN: [''], // Box 9
    box1_grossWinnings: [0],
    box2_dateWon: [''],
    box3_typeOfWager: [''],
    box4_federalTaxWithheld: [0],
    box5_transaction: [''],
    box6_race: [''],
    box7_identicalWagers: [0],
    box8_cashier: [''],
    box10_window: [''],
    box11_firstID: [''],
    box12_secondID: [''],
    box13_payerStateID: [''],
    box14_stateIncomeTax: [0],
    box15_localWinnings: [0],
    box16_localIncomeTax: [0],
    box17_localityType: [''],
    box18_stateName: ['']
  });

  onSubmit() {
    console.log('Form W-2G Submitted', this.form.value);
  }
}
