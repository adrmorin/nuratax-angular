import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form4563',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4563.component.html',
  styleUrl: './form4563.component.css'
})
export class Form4563Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    foreignAddress: [''],
    // Part I
    dateArrivedSamoa: [''],
    dateLeftSamoa: [''],
    isBonaFide: [false],
    // Part II
    wagesSamoa: [0],
    wagesOther: [0],
    dividendsSamoa: [0],
    dividendsOther: [0],
    interestSamoa: [0],
    interestOther: [0]
  });

  onSubmit() {
    console.log('Form 4563 Submitted', this.form.value);
  }
}
