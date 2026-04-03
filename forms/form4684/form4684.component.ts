import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-4684', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form4684.component.html', styleUrls: ['./form4684.component.css'] })
export class Form4684Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ssn: [''], description: [''], dateLost: [''], fairMarketValue: [0], fairMarketValueAfter: [0], loss: [{ value: 0, disabled: true }], insurance: [0], deductibleLoss: [0], totalLoss1: [0], totalReimbursements: [0], totalDeductible: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ loss: (Number(v.fairMarketValue) || 0) - (Number(v.fairMarketValueAfter) || 0), totalDeductible: (Number(v.totalLoss1) || 0) - (Number(v.totalReimbursements) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 4684 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}