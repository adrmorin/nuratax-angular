import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8801',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8801.component.html',
  styleUrls: ['./form8801.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8801Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    tin: [''],
    line1: [null],
    line2: [null],
    line3: [null],
    line4: [null],
    line5: [null],
    line6: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  line7 = computed(() => {
    const vals = this.formValues();
    const l4 = parseFloat(vals.line4) || 0;
    const l6 = parseFloat(vals.line6) || 0;
    return Math.max(0, l4 - l6);
  });

  onSubmit() {
    console.log('Form 8801 Submitted', this.form.getRawValue());
    alert('Form 8801 data saved locally!');
  }
}
