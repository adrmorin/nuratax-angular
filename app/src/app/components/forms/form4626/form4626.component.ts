import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form4626',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4626.component.html',
  styleUrls: ['./form4626.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form4626Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ein: [''],
    qA: [null],
    qB: [null],
    qC: [null],
    // Part I grid
    l1a_y1: [null],
    l1a_y2: [null],
    l1a_y3: [null],
    l1b_y1: [null],
    l1b_y2: [null],
    l1b_y3: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  onSubmit() {
    console.log('Form 4626 Submitted', this.form.getRawValue());
    alert('Form 4626 data saved locally!');
  }
}
