import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-fbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fbar.component.html',
  styleUrl: './fbar.component.css'
})
export class FbarComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    filerName: [''],
    tin: [''],
    dob: [''],
    accounts: this.fb.array([])
  });

  get accounts() { return this.form.get('accounts') as FormArray; }

  addAccount() {
    this.accounts.push(this.fb.group({
      maxValue: [0],
      accountType: ['bank'],
      institutionName: [''],
      accountNumber: [''],
      address: [''],
      country: ['']
    }));
  }

  onSubmit() {
    console.log('FBAR Submitted', this.form.value);
  }
}
