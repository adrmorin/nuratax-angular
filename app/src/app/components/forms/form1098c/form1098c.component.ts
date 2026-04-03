import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1098c',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1098c.component.html',
  styleUrl: './form1098c.component.css'
})
export class Form1098CComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    doneeName: [''],
    doneeTIN: [''],
    donorTIN: [''],
    donorName: [''],
    dateContribution: [''],
    vin: [''],
    year: [''],
    make: [''],
    model: [''],
    odometer: [''],
    grossProceeds: [0],
    isGrossProceedsOnly: [false],
    doneeCertification: ['']
  });

  onSubmit() {
    console.log('Form 1098-C Submitted', this.form.value);
  }
}
