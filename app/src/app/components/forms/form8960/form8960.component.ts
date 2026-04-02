import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8960',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8960.component.html',
  styleUrls: ['./form8960.component.css']
})
export class Form8960Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], tin: [''],
      elect_6013g: [false], elect_6013h: [false], elect_Reg11411: [false],
      // Part I
      line1: [''], line2: [''], line3: [''],
      line4a: [''], line4b: [''], line4c: [''],
      line5a: [''], line5b: [''], line5c: [''], line5d: [''],
      // Part II
      line9a: [''], line9b: [''], line9c: [''],
      // Part III
      line12: [''], line13: [''], line17: [''], line21: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8960 (2025):', this.form.value);
  }
}