import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1099ls',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1099ls.component.html',
  styleUrl: './form1099ls.component.css'
})
export class Form1099lsComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    acquirerName: [''],
    acquirerTIN: [''],
    recipientName: [''],
    recipientTIN: [''],
    accountNum: [''],
    box1_amountPaid: [0],
    box2_dateOfSale: ['']
  });

  onSubmit() {
    console.log('Form 1099-LS Submitted', this.form.value);
  }
}
