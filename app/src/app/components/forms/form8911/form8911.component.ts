import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form8911',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8911.component.html',
  styleUrls: ['./form8911.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form8911Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    tin: [''],
    l1: [null],
    l2: [null],
    l4: [null],
    l5: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  l3 = computed(() => (parseFloat(this.formValues().l1) || 0) + (parseFloat(this.formValues().l2) || 0));

  onSubmit() {
    console.log('Form 8911 Submitted', this.form.getRawValue());
    alert('Form 8911 data saved locally!');
  }
}
