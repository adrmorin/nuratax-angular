import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-form8986',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8986.component.html',
  styleUrl: './form8986.component.css'
})
export class Form8986Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    auditControlNumber: [''],
    trackingNumber: [''],
    isOriginal: [true],
    isCorrected: [false],
    entityName: [''],
    entityEIN: [''],
    partnerName: [''],
    partnerTIN: [''],
    adjustments: this.fb.array([
      this.createAdjustmentRow('1', 'Ordinary business income (loss)'),
      this.createAdjustmentRow('2', 'Net rental real estate income (loss)'),
      this.createAdjustmentRow('3', 'Other net rental income (loss)'),
      this.createAdjustmentRow('4', 'Guaranteed payments for services'),
      this.createAdjustmentRow('5', 'Interest income'),
      this.createAdjustmentRow('6a', 'Ordinary dividends'),
      this.createAdjustmentRow('7', 'Royalties')
    ])
  });

  createAdjustmentRow(line: string, desc: string) {
    return this.fb.group({
      line: [line],
      description: [desc],
      code: [''],
      asReported: [0],
      adjustment: [0]
    });
  }

  get adjustments() { return this.form.get('adjustments') as FormArray; }

  // Computed corrected amounts for the UI
  correctedAmounts = computed(() => {
    return this.adjustments.controls.map(ctrl => {
      const v = ctrl.value;
      return (v.asReported || 0) + (v.adjustment || 0);
    });
  });

  onSubmit() {
    console.log('Form 8986 Submitted', this.form.value);
  }
}
