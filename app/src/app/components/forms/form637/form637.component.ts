import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form637',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form637.component.html',
  styleUrls: ['./form637.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form637Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    legal_name: [''],
    ein: [''],
    trade_name: [''],
    phone: [''],
    address: [''],
    fax: [''],
    city_state_zip: [''],
    // Part II
    activity1_letter: [''],
    activity1_desc: [''],
    // Part III
    q1a: [false],
    q1b: [false],
    q1c: [false],
    business_start_month: [''],
    business_start_year: ['']
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  onSubmit() {
    console.log('Form 637 Submitted', this.form.getRawValue());
    alert('Form 637 data saved locally!');
  }
}
