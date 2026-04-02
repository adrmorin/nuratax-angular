import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form1099k',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099k.component.html',
  styleUrls: ['./form1099k.component.css']
})
export class Form1099kComponent {
  form1099k: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form1099k = this.fb.group({
      filerInfo: [''],
      filerTIN: [''],
      payeeTIN: [''],
      payeeName: [''],
      payeeAddress: [''],
      payeeCityStateZip: [''],
      accountNumber: [''],
      paysecType: [''], // radio: paymentCard | thirdPartyNetwork
      box1a: [''],
      box1b: [''],
      box2: [''],
      box3: [''],
      box4: [''],
      box5a: [''], box5b: [''], box5c: [''], box5d: [''],
      box5e: [''], box5f: [''], box5g: [''], box5h: [''],
      box5i: [''], box5j: [''], box5k: [''], box5l: [''],
      box6State1: [''], box7StateId1: [''], box8StateTax1: [''],
      box6State2: [''], box7StateId2: [''], box8StateTax2: ['']
    });
  }

  onSubmit() {
    console.log('Form 1099-K submitted:', this.form1099k.value);
  }
}
