import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form7204',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form7204.component.html',
  styleUrls: ['./form7204.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form7204Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    taxpayerName: [''],
    ssnOrEin: [''],
    address: [''],
    taxYear: ['']
  });

  onSubmit() {
    console.log('Form 7204 Submitted', this.form.getRawValue());
    alert('Form 7204 saved locally!');
  }
}
