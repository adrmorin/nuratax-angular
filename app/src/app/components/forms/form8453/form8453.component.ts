import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form8453',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8453.component.html',
  styleUrl: './form8453.component.css'
})
// Form 8453 - U.S. Individual Income Tax Transmittal for an IRS e-file Return
export class Form8453Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    donorName: [''],
    donorSSN: [''],
    hasForm1098C: [false],
    hasForm2848: [false],
    hasForm3115: [false],
    hasForm3468: [false],
    hasForm4136: [false],
    hasForm5713: [false],
    hasForm8283: [false],
    hasForm8332: [false],
    hasForm8858: [false],
    hasForm8864: [false],
    hasForm8885: [false],
    hasForm8915F: [false]
  });

  onSubmit() {
    console.log('Form 8453 Submitted', this.form.value);
  }
}
