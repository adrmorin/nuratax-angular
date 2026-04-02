import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8834',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8834.component.html',
  styleUrls: ['./form8834.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8834Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    tin: [''],
    line1: [null],
    line2: [null],
    line3a: [null],
    line3b: [null],
    line5: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  line3c = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line3a) || 0) + (parseFloat(vals.line3b) || 0);
  });

  line4 = computed(() => {
    const vals = this.formValues();
    const l2 = parseFloat(vals.line2) || 0;
    const l3c = this.line3c();
    return Math.max(0, l2 - l3c);
  });

  onSubmit() {
    console.log('Form 8834 Submitted', this.form.getRawValue());
    alert('Form 8834 data saved locally!');
  }
}
