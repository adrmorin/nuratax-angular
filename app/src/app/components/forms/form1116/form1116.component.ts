import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form1116',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1116.component.html',
  styleUrls: ['./form1116.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form1116Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    categoryOfIncome: [''],
    countryName: [''],
    // Part I
    line1a: [null],
    line1b: [null],
    line2: [null],
    line3a: [null],
    line3b: [null],
    line3c: [null],
    line3d: [null],
    line3e: [null],
    line3f: [null],
    line3g: [null],
    line4a: [null],
    line4b: [null],
    line5: [null],
    line6: [null],
    line7: [null],
    // Part II
    line8: [null],
    // Part III
    line9: [null],
    line10: [null],
    line11: [null],
    line12: [null],
    line13: [null],
    line14: [null],
    line15: [null],
    line16: [null],
    line17: [null],
    line18: [null],
    line19: [null],
    line20: [null],
    line21: [null],
    line22: [null],
    line23: [null],
    line24: [null]
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  // Example calculation
  totalPartI = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line1a) || 0) + (parseFloat(vals.line1b) || 0);
  });

  onSubmit() {
    console.log('Form 1116 Submitted', this.form.getRawValue());
    alert('Form 1116 saved locally!');
  }
}
