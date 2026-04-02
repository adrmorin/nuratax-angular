import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form1099r',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099r.component.html',
  styleUrls: ['./form1099r.component.css']
})
export class Form1099rComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      payerName: [''], payerAddress: [''], payerCityStateZip: [''], payerTin: [''],
      recipientTin: [''], recipientName: [''], recipientAddress: [''], recipientCityStateZip: [''],
      box1: [''], box2a: [''], box2bTaxNotDet: [false], box2bTotalDist: [false],
      box3: [''], box4: [''], box5: [''], box6: [''],
      box7Code: [''], box7IraSepSimple: [false],
      box8: [''], box9a: [''], box9b: [''],
      box10: [''], box11: [''], box12: [false], box13: [''],
      box14: [''], box15: [''], box16: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 1099-R (2025):', this.form.value);
  }
}
