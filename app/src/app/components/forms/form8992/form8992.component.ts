import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8992',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8992.component.html',
  styleUrls: ['./form8992.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8992Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    taxId: [''],
    line1: [null],
    line2: [null]
  });

  onSubmit() {
    console.log('Form 8992 Submitted', this.form.getRawValue());
    alert('Form 8992 saved locally!');
  }
}
