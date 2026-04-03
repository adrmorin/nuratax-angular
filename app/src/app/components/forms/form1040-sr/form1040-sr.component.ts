import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1040sr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1040-sr.component.html',
  styleUrl: './form1040-sr.component.css'
})
export class Form1040SRComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    ssn: [''],
    age65: [false],
    blind: [false],
    spouseAge65: [false],
    spouseBlind: [false]
  });

  onSubmit() {
    console.log('1040-SR Submitted', this.form.value);
  }
}
