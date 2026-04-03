import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1098',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1098.component.html',
  styleUrl: './form1098.component.css'
})
// Form 1098 - Mortgage Interest Statement
export class Form1098Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    recipientName: [''],
    recipientTIN: [''],
    payerName: [''],
    payerTIN: [''],
    box1_interest: [0],
    box2_principal: [0],
    box3_originationDate: [''],
    box4_refund: [0],
    box5_mip: [0],
    box6_points: [0]
  });

  onSubmit() {
    console.log('Form 1098 Submitted', this.form.value);
  }
}
