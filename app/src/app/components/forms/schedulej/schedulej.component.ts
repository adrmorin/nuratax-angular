import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedulej',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedulej.component.html',
  styleUrls: ['./schedulej.component.css']
})
export class SchedulejComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      nameOfPerson: [''], identNumber: [''],
      nameOfForeignCorp: [''], corpTin: [''],
      // Part I - Representative Row 1
      p1_row1a: [''], p1_row1b: [''], p1_row1c: [''], p1_row1d: [''], p1_row1e: [''], p1_row1f: [''],
      // Part II - Representative Row 1
      p2_row1a: [''], p2_row1b: [''], p2_row1c: [''], p2_row1d: [''], p2_row1e: [''], p2_row1f: [''], p2_row1g: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Schedule J (Form 5471) (2025):', this.form.value);
  }
}