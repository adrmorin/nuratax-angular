import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-form8283',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8283.component.html',
  styleUrl: './form8283.component.css'
})
export class Form8283Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    donorName: [''],
    donorSSN: [''],
    properties: this.fb.array([
      this.createPropertyRow()
    ])
  });

  get properties() {
    return this.form.get('properties') as FormArray;
  }

  createPropertyRow(): FormGroup {
    return this.fb.group({
      doneeName: [''],
      vehicleID: [''],
      dateContribution: [''],
      dateAcquired: [''],
      howAcquired: [''],
      costBasis: [0],
      fairMarketValue: [0],
      valuationMethod: ['']
    });
  }

  addProperty() {
    this.properties.push(this.createPropertyRow());
  }

  removeProperty(index: number) {
    if (this.properties.length > 1) {
      this.properties.removeAt(index);
    }
  }

  onSubmit() {
    console.log('Form 8283 Submitted', this.form.value);
  }
}
