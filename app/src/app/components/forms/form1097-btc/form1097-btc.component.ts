import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1097btc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1097-btc.component.html',
  styleUrls: ['./form1097-btc.component.css']
})
export class Form1097BTCComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    issuerName: [''],
    issuerAddress: [''],
    issuerPhone: [''],
    issuerTIN: [''],
    recipientTIN: [''],
    recipientName: [''],
    recipientAddress: [''],
    calendarYear: ['2025'],
    box1: [0],
    box2a: ['C'],
    box2b: [''],
    box3: ['199'],
    m1: [0], m2: [0], m3: [0], m4: [0], m5: [0], m6: [0],
    m7: [0], m8: [0], m9: [0], m10: [0], m11: [0], m12: [0],
    box6: ['']
  });

  onSubmit() {
    console.log('Form 1097-BTC Submitted', this.form.value);
  }
}
