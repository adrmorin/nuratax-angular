import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8689',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8689.component.html',
  styleUrls: ['./form8689.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8689Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    line1: [null],
    line2: [null],
    line3: [null]
  });

  onSubmit() {
    console.log('Form 8689 Submitted', this.form.getRawValue());
    alert('Form 8689 saved locally!');
  }
}
