import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form3922',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form3922.component.html',
  styleUrl: './form3922.component.css'
})
export class Form3922Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    corpName: [''],
    corpEIN: [''],
    employeeName: [''],
    employeeSSN: [''],
    accountNum: [''],
    box1_dateGranted: [''],
    box2_dateExercised: [''],
    box3_fmvGrantDate: [0],
    box4_fmvExerciseDate: [0],
    box5_exercisePrice: [0],
    box6_shares: [0],
    box7_dateTitleTransferred: [''],
    box8_exercisePriceAsIf: [0]
  });

  onSubmit() {
    console.log('Form 3922 Submitted', this.form.value);
  }
}
