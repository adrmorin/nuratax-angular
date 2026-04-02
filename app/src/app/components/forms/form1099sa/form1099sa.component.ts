import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form1099sa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099sa.component.html',
  styleUrls: ['./form1099sa.component.css']
})
export class Form1099saComponent {
  form1099sa: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form1099sa = this.fb.group({
      payerName: [''],
      payerStreetAddress: [''],
      payerCity: [''],
      payerState: [''],
      payerZipCode: [''],
      payerTin: [''],
      recipientTin: [''],
      recipientName: [''],
      recipientStreetAddress: [''],
      recipientCity: [''],
      recipientState: [''],
      recipientZipCode: [''],
      recipientAccountNumber: [''],
      box1: [''],
      box2: [''],
      box3: [''],
      box4: [''],
      box5Medicare: [false],
      box5Hsa: [false],
      box5Archer: [false]
    });
  }

  onSubmit() {
    console.log('Form 1099-SA submitted:', this.form1099sa.value);
  }
}
