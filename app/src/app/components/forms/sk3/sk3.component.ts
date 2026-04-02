import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sk3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sk3.component.html',
  styleUrls: ['./sk3.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sk3Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    partnership_ein: [''],
    partnership_name_address: [''],
    partner_tin: [''],
    partner_name_address: [''],
    check_p1: [false],
    check_p2: [false],
    check_p3: [false],
    check_p4: [false],
    check_p5: [false],
    check_p6: [false],
    check_p7: [false],
    check_p8: [false],
    check_p9: [false],
    check_p10: [false],
    check_p11: [false],
    check_p12: [false],
    check_p13: [false],
    is_amended: [false]
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  onSubmit() {
    console.log('Schedule K-3 Submitted', this.form.getRawValue());
    alert('Schedule K-3 data saved locally!');
  }
}
