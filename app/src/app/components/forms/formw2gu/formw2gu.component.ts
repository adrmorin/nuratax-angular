import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formw2gu',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formw2gu.component.html',
  styleUrls: ['../formw2/formw2.component.css']
})
export class Formw2guComponent {
  formW2: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.formW2 = this.fb.group({
      boxA: [''], boxB: [''], boxCName: [''], boxCAddr: [''],
      boxD: [''], boxEFirst: [''], boxELast: [''], boxF: [''],
      box1: [''], box2: [''], box3: [''], box4: [''], box5: [''], box6: [''],
      box7: [''], box8: [''], box9: [''], box10: [''], box11: [''],
      box12aCode: [''], box12aAmount: [''],
      box12bCode: [''], box12bAmount: [''],
      box12cCode: [''], box12cAmount: [''],
      box12dCode: [''], box12dAmount: [''],
      box13Statutory: [false], box13Retirement: [false], box13SickPay: [false],
      box14: [''], box15State: [''], box15ID: [''], box16: [''], box17: [''], box18: [''], box19: [''], box20: ['']
    });
  }

  onSubmit() {
    console.log('Form W-2GU submitted:', this.formW2.value);
  }
}
