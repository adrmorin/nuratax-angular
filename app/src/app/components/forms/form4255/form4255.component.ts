import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form4255',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4255.component.html',
  styleUrls: ['./form4255.component.css']
})
export class Form4255Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      rows: this.fb.array([
        this.createRow('1a', 'Form 7207'),
        this.createRow('1b', 'Form 3468, Part III'),
        this.createRow('1h', 'Form 6936, Part II'),
        this.createRow('1l', 'Form 3468, Part III'),
        this.createRow('1n', 'Form 6936'),
        this.createRow('2a', 'Form 8933'),
        this.createRow('2b', 'Form 8911'),
        this.createRow('3', 'Total')
      ])
    });
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  createRow(line: string, source: string) {
    return this.fb.group({
      line: [line],
      source: [source],
      colA: [''], colB: [''], colC: [''], colD: [''], colE: [''], colF: [''], colG: [''], colH: [''], colI: [''],
      colJ: [''], colK: [''], colL: [''], colM1: [''], colM2: [''], colM3: [''], colN1: [''], colN2: [''], colN3: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 4255 (2025):', this.form.value);
  }
}
