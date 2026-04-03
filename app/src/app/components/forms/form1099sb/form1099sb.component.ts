import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1099sb',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099sb.component.html',
  styleUrl: './form1099sb.component.css'
})
export class Form1099sbComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    issuerName: [''],
    issuerTIN: [''],
    sellerName: [''],
    sellerTIN: [''],
    accountNum: [''],
    box1_investmentInContract: [0],
    box2_surrenderAmount: [0]
  });

  onSubmit() {
    console.log('Form 1099-SB Submitted', this.form.value);
  }
}
