import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-6252', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form6252.component.html', styleUrls: ['./form6252.component.css'] })
export class Form6252Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ssn: [''], description: [''], dateSold: [''], contractPrice: [0], costBasis: [0], grossProfit: [0], contractPriceReceived: [0], gpr: [{ value: 0, disabled: true }], paymentsReceived: [0], interestIncome: [0], installmentIncome: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); const gpr = (Number(v.grossProfit) || 0) / (Number(v.contractPrice) || 1); const installmentIncome = ((Number(v.paymentsReceived) || 0) - (Number(v.contractPriceReceived) || 0)) * gpr; this.taxForm.patchValue({ gpr: gpr, installmentIncome: installmentIncome }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 6252 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}