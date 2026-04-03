import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8283',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8283.component.html',
  styleUrls: ['./form8283.component.css']
})
export class Form8283Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  totalContributions = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      items: this.fb.array([
        this.createItem(),
        this.createItem()
      ])
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: [''],
      date: [''],
      fairMarketValue: [0],
      method: ['']
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  calculateValues(val: { items: { fairMarketValue: number | string }[] }): void {
      const sum = val.items.reduce((acc: number, item: { fairMarketValue: number | string }) => acc + (Number(item.fairMarketValue) || 0), 0);
      this.totalContributions.set(sum);
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  onSubmit(): void {
    console.log('Form 8283 Data:', this.form.value);
  }
}
