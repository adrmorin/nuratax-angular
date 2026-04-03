import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-w2c',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-w2c.component.html',
  styleUrls: ['./form-w2c.component.css']
})
export class FormW2cComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    taxYear: ['2025'],
    employerEIN: [''],
    employerName: [''],
    employeeSSN_Prev: [''],
    employeeSSN_Correct: [''],
    employeeName_Prev: [''],
    employeeName_Correct: [''],
    
    // Boxes 1-6 (Previous vs Correct)
    box1_prev: [0], box1_correct: [0],
    box2_prev: [0], box2_correct: [0],
    box3_prev: [0], box3_correct: [0],
    box4_prev: [0], box4_correct: [0],
    box5_prev: [0], box5_correct: [0],
    box6_prev: [0], box6_correct: [0],
    
    // State/Local (Box 15-20)
    stateID: [''],
    stateWages_prev: [0], stateWages_correct: [0]
  });

  onSubmit() {
    console.log('Form W-2c Submitted', this.form.value);
  }
}
