import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8609',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8609.component.html',
  styleUrls: ['./form8609.component.css']
})
export class Form8609Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      buildingAddr: [''], agencyName: [''], agencyAddr: [''],
      ownerName: [''], ownerTin: [''], bin: [''],
      // Part I
      line1a: [''], line1b: [''], line2: [''], line3a: [''], line3b: [''],
      line4: [''], line5: [''], line6: [''],
      // Part II
      line7: [''], line8a: [''], line8b: [''], line9a: [''], line9b: [''],
      line10a: [''], line10b: [''], line10c: [''], line10d: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8609 (2025):', this.form.value);
  }
}