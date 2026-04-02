import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8609a',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8609a.component.html',
  styleUrls: ['./form8609a.component.css']
})
export class Form8609aComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], identNumber: [''],
      // Part I
      bin: [''], buildingType: [''],
      q1: [null], q2: [null], q3: [null], q4: [null],
      // Part II
      line1: [''], line2: [''], line3: [''], line4: [''], line5: [''],
      line6: [''], line7: [''], line8: [''], line9: [''], line10: [''],
      line11: [''], line12: [''], line13: [''], line14: [''], line15: [''],
      line16: [''], line17: [''], line18: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8609-A (2025):', this.form.value);
  }
}