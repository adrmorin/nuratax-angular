import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form3468',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form3468.component.html',
  styleUrls: ['./form3468.component.css']
})
export class Form3468Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''],
      identifyingNumber: [''],
      // Part I: Facility Information
      regNumber: [''], hydrogenEmissions: [''], doeControl: [''],
      address: [''], latitude: [''], longitude: [''],
      startDate: [''], inServiceDate: [''],
      wageMet: [false], domesticMet: [false], communityMet: [false], lowIncomeMet: [false],
      // Part II
      line12: [''], line13: [''], line14: [''], line15: [''], line16: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 3468 (2025):', this.form.value);
  }
}