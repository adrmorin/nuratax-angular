import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form8859',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8859.component.html',
  styleUrls: ['./form8859.component.css']
})
export class Form8859Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    carryforwardPrev: [0],
    taxLimit: [0]
  });

  currentYearCredit = computed(() => {
    const carry = this.form.get('carryforwardPrev')?.value || 0;
    const limit = this.form.get('taxLimit')?.value || 0;
    return Math.min(carry, limit);
  });

  carryforwardNext = computed(() => {
    const carry = this.form.get('carryforwardPrev')?.value || 0;
    return Math.max(0, carry - this.currentYearCredit());
  });

  onSubmit() {
    console.log('Form 8859 Submitted', this.form.value);
  }
}
