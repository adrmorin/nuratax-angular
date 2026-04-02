import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8936',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8936.component.html',
  styleUrls: ['./form8936.component.css']
})
export class Form8936Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''],
      identifyingNumber: [''],
      // Part I: MAGI
      line1a: [''], line1b: [''], line1c: [''], line1d: [''], line1e: [''],
      line2: [''],
      line3a: [''], line3b: [''], line3c: [''], line3d: [''], line3e: [''],
      line4: [''],
      line5: [''],
      // Part II: Business
      line6: [''], line7: [''], line8: [''], line9: [''], line10: [''], line11: [''], line12: [''], line13: [''], line14: [''], line15: [''],
      // Part III: Personal
      line16: [''], line17: [''], line18: [''], line19: [''], line20: [''], line21: [''], line22: [''],
      // Part IV: Previous
      line23: [''], line24: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8936 - Clean Vehicle Credits (2025):', this.form.value);
  }
}