import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8849',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8849.component.html',
  styleUrls: ['./form8849.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8849Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ein: [''],
    ssn: [''],
    address: [''],
    city_state_zip: [''],
    phone: [''],
    // Checkboxes
    sched1: [false],
    sched2: [false],
    sched3: [false],
    sched5: [false],
    sched6: [false],
    sched8: [false]
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  onSubmit() {
    console.log('Form 8849 Submitted', this.form.getRawValue());
    alert('Form 8849 data saved locally!');
  }
}
