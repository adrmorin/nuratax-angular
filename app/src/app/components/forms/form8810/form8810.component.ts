import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8810',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8810.component.html',
  styleUrls: ['./form8810.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8810Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ein: [''],
    l1a: [null],
    l1b: [null],
    l1c: [null],
    l2: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  line1d = computed(() => {
    const vals = this.formValues();
    const a = parseFloat(vals.l1a) || 0;
    const b = parseFloat(vals.l1b) || 0;
    const c = parseFloat(vals.l1c) || 0;
    return a + b + c; // b and c are negative in logic
  });

  onSubmit() {
    console.log('Form 8810 Submitted', this.form.getRawValue());
    alert('Form 8810 data saved locally!');
  }
}
