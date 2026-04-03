import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-schedule-a-8911',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule-a-8911.component.html',
  styleUrls: ['./schedule-a-8911.component.css']
})
export class ScheduleA8911Component {
  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    registrationNumber: [''],
    ownerName: [''],
    ownerTIN: [''],
    streetAddress: [''],
    city: [''],
    state: [''],
    zipCode: [''],
    latitude: [''],
    longitude: [''],
    dateConstruction: [''],
    datePlacedInService: [''],
    eligibleCensusTract: [false],
    geoid: [''],
    hardwareCost: [0],
    wiringCost: [0],
    conduitCost: [0],
    prevailingWage: [false]
  });

  totalCost = signal(0);

  calculateTotal() {
    const hw = this.form.get('hardwareCost')?.value || 0;
    const wr = this.form.get('wiringCost')?.value || 0;
    const cd = this.form.get('conduitCost')?.value || 0;
    this.totalCost.set(hw + wr + cd);
  }

  onSubmit() {
    console.log('Form Submitted', this.form.value);
  }
}
