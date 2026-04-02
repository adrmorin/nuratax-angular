import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8889',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8889.component.html',
  styleUrls: ['./form8889.component.css']
})
export class Form8889Component {
  form8889: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form8889 = this.fb.group({
      name: [''],
      ssn: [''],
      // Part I
      line1Self: [false],
      line1Family: [false],
      line2: [''],
      line3: [''],
      line8: [''],
      line13: [''],
      // Part II
      line14a: [''],
      line14b: [''],
      line14c: [''],
      line15: [''],
      line16: [''],
      line17: ['']
    });
  }

  onSubmit() {
    console.log('Form 8889 submitted:', this.form8889.value);
  }
}
