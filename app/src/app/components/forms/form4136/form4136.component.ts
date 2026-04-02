import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form4136',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4136.component.html',
  styleUrls: ['./form4136.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form4136Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    tin: [''],
    p1a: [false], // Qualifying business activity
    p1b_count: [null],
    // Part II table simplified
    line1a_gallons: [null],
    line1a_credit: [null],
    line1b_gallons: [null],
    line1b_credit: [null],
    line2a_gallons: [null],
    line2a_credit: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  totalCredit = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line1a_credit) || 0) + (parseFloat(vals.line1b_credit) || 0) + (parseFloat(vals.line2a_credit) || 0);
  });

  onSubmit() {
    console.log('Form 4136 Submitted', this.form.getRawValue());
    alert('Form 4136 data saved locally!');
  }
}
