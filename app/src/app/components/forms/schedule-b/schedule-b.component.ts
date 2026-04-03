import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-schedule-b',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-b.component.html',
  styleUrl: './schedule-b.component.css'
})
export class ScheduleBComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    interestItems: this.fb.array([]),
    dividendItems: this.fb.array([]),
    hasForeignAccount: [false],
    foreignCountry: ['']
  });

  get interestItems() { return this.form.get('interestItems') as FormArray; }
  get dividendItems() { return this.form.get('dividendItems') as FormArray; }

  addInterestItem() {
    this.interestItems.push(this.fb.group({ payer: [''], amount: [0] }));
  }

  addDividendItem() {
    this.dividendItems.push(this.fb.group({ payer: [''], amount: [0] }));
  }

  onSubmit() {
    console.log('Schedule B Submitted', this.form.value);
  }
}
