import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form8693',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8693.component.html',
  styleUrls: ['./form8693.component.css']
})
export class Form8693Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      taxpayer_name: [''], identifying_number: [''],
      // Part I
      building_address: [''], bin: [''], compliance_period_end_date: [''],
      bond_type: ['original'], 
      disposal_date: [''], bond_issue_date: [''],
      principal_name: [''], surety_name: [''], bond_amount: [''],
      // Part II
      principal_sig_date: [''], surety_sig_date: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 8693 (2025):', this.form.value);
  }
}