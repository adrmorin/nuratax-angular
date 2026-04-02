import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8621',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8621.component.html',
  styleUrls: ['./form8621.component.css']
})
export class Form8621Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      shareholderName: [''], shareholderTin: [''], shareholderAddr: [''],
      shareholderType: ['individual'],
      // Part I
      line1: [''], line2: [''], line3: [''], line4: [''], line5: [''],
      // Part II Elections
      electA: [false], electB: [false], electC: [false], 
      electD: [false], electE: [false], electF: [false],
      // Calculations
      part3_line6a: [''], part4_line8: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8621 (2025):', this.form.value);
  }
}