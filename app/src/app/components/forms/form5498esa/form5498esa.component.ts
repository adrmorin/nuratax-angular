import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form5498esa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5498esa.component.html',
  styleUrl: './form5498esa.component.css'
})
export class Form5498esaComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    issuerName: [''],
    issuerTIN: [''],
    beneficiaryName: [''],
    beneficiaryTIN: [''],
    accountNum: [''],
    box1_esaContrib: [0],
    box2_rolloverContrib: [0]
  });

  onSubmit() {
    console.log('Form 5498-ESA Submitted', this.form.value);
  }
}
