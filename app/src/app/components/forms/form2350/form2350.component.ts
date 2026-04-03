import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form2350',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form2350.component.html',
  styleUrl: './form2350.component.css'
})
export class Form2350Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    foreignAddress: [''],
    expectedExtensionDate: [''],
    dateArrivedForeign: [''],
    beginQualifyingPeriod: [''],
    endQualifyingPeriod: [''],
    signatureDate: ['']
  });

  onSubmit() {
    console.log('Form 2350 Submitted', this.form.value);
  }
}
