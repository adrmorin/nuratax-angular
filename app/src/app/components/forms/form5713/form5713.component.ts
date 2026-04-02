import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form5713',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5713.component.html',
  styleUrls: ['./form5713.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form5713Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    taxId: [''],
    boycottingCountry: [''],
    line1: [null],
    line2: [null]
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  onSubmit() {
    console.log('Form 5713 Submitted', this.form.getRawValue());
    alert('Form 5713 saved locally!');
  }
}
