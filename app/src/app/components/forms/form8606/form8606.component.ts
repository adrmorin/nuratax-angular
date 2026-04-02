import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8606',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8606.component.html',
  styleUrls: ['./form8606.component.css']
})
export class Form8606Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], ssn: [''],
      // Part I
      line1: [''], line2: [''], line3: [''],
      line4: [''], line5: [''], line6: [''], line7: [''], line8: [''], line9: [''],
      line10: [''], line11: [''], line12: [''], line13: [''], line14: [''], line15: [''],
      // Part II
      line16: [''], line17: [''], line18: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8606 (2025):', this.form.value);
  }
}