import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form5329',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5329.component.html',
  styleUrls: ['./form5329.component.css']
})
export class Form5329Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], ssn: [''],
      address: [''], cityStateZip: [''],
      // Part I
      line1: [''], line2: [''], line3: [''], line4: [''],
      // Part II
      line5: [''], line6: [''], line7: [''], line8: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 5329 (2025):', this.form.value);
  }
}