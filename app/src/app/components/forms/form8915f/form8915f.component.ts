import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8915f',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8915f.component.html',
  styleUrls: ['./form8915f.component.css']
})
export class Form8915fComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], ssn: [''],
      // Part I
      femaNumber: [''], disasterStartDate: [''], disasterLocation: [''],
      // Part II
      line1: [''], line2: [''], line3: [''], line4: [''], line5: [''],
      // Part III
      line6: [''], line7: [''], line8: [''], line9: [''], line10: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8915-F (2025):', this.form.value);
  }
}