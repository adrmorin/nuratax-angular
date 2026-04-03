import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-2106', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form2106.component.html', styleUrls: ['./form2106.component.css'] })
export class Form2106Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup; mileageRate2026 = 0.70;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ssn: [''], businessMiles: [0], mileageRate: [0.70], vehicleExpense: [{ value: 0, disabled: true }], parking: [0], transportation: [0], meals: [0], supplies: [0], otherBusiness: [0], totalExpenses: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ vehicleExpense: (Number(v.businessMiles) || 0) * (Number(v.mileageRate) || 0.70), totalExpenses: ((Number(v.businessMiles) || 0) * (Number(v.mileageRate) || 0.70)) + (Number(v.parking) || 0) + (Number(v.transportation) || 0) + (Number(v.meals) || 0) + (Number(v.supplies) || 0) + (Number(v.otherBusiness) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 2106 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}