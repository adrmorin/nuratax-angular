import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form3921',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form3921.component.html',
  styleUrl: './form3921.component.css'
})
export class Form3921Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    corpName: [''],
    corpEIN: [''],
    employeeName: [''],
    employeeSSN: [''],
    accountNum: [''],
    box1_dateGranted: [''],
    box2_dateExercised: [''],
    box3_exercisePrice: [0],
    box4_fmv: [0],
    box5_shares: [0],
    box6_otherCorp: ['']
  });

  onSubmit() {
    console.log('Form 3921 Submitted', this.form.value);
  }
}
