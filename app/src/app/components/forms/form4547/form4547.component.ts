import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-form4547',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form4547.component.html',
  styleUrls: ['./form4547.component.css']
})
export class Form4547Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    responsibleName: [''],
    responsibleTIN: [''],
    responsibleAddress: [''],
    children: this.fb.array([
      this.createChildGroup()
    ]),
    consentDisclosure: [false],
    consentMaintenance: [false]
  });

  createChildGroup() {
    return this.fb.group({
      name: [''],
      tin: [''],
      dob: [''],
      requestContribution: [true] // Flag for the $1,000 seed
    });
  }

  get children() { return this.form.get('children') as FormArray; }

  addChild() {
    this.children.push(this.createChildGroup());
  }

  onSubmit() {
    console.log('Form 4547 Submitted', this.form.value);
  }
}
