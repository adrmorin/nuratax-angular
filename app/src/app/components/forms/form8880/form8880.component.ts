import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8880',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8880.component.html',
  styleUrls: ['./form8880.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8880Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    l1a: [null],
    l1b: [null],
    l2a: [null],
    l2b: [null],
    l7: [null], // Percentage
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  l3a = computed(() => (parseFloat(this.formValues().l1a) || 0) + (parseFloat(this.formValues().l2a) || 0));
  l3b = computed(() => (parseFloat(this.formValues().l1b) || 0) + (parseFloat(this.formValues().l2b) || 0));

  onSubmit() {
    console.log('Form 8880 Submitted', this.form.getRawValue());
    alert('Form 8880 data saved locally!');
  }
}
