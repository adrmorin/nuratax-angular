import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8582cr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8582cr.component.html',
  styleUrls: ['./form8582cr.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8582CRComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    tin: [''],
    line1a: [null],
    line1b: [null],
    line2a: [null],
    line2b: [null],
    line3a: [null],
    line3b: [null],
    line4a: [null],
    line4b: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  line1c = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line1a) || 0) + (parseFloat(vals.line1b) || 0);
  });

  line2c = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line2a) || 0) + (parseFloat(vals.line2b) || 0);
  });

  totalC = computed(() => this.line1c() + this.line2c());

  onSubmit() {
    console.log('Form 8582-CR Submitted', this.form.getRawValue());
    alert('Form 8582-CR data saved locally!');
  }
}
