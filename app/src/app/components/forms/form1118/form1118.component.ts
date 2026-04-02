import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form1118',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1118.component.html',
  styleUrls: ['./form1118.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form1118Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    corporationName: [''],
    ein: [''],
    categoryOfIncome: [''],
    // Schedule A
    line1: [null],
    line2: [null],
    line3: [null]
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  totalScheduleA = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line1) || 0) + (parseFloat(vals.line2) || 0);
  });

  onSubmit() {
    console.log('Form 1118 Submitted', this.form.getRawValue());
    alert('Form 1118 saved locally!');
  }
}
