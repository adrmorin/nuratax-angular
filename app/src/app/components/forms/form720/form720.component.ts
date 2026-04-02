import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-form720',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form720.component.html',
  styleUrls: ['./form720.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form720Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ein: [''],
    address: [''],
    quarter_ending: [''],
    // Environmental Taxes
    line53: [null],
    line18: [null],
    line16: [null],
    line21: [null],
    // Communications
    line22: [null],
    line26: [null],
  });

  formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  totalPartI = computed(() => {
    const vals = this.formValues();
    return (parseFloat(vals.line53) || 0) + (parseFloat(vals.line18) || 0) + (parseFloat(vals.line16) || 0) + 
           (parseFloat(vals.line21) || 0) + (parseFloat(vals.line22) || 0) + (parseFloat(vals.line26) || 0);
  });

  onSubmit() {
    console.log('Form 720 Submitted', this.form.getRawValue());
    alert('Form 720 data saved locally!');
  }
}
