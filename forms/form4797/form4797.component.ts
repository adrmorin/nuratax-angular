import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-4797', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form4797.component.html', styleUrls: ['./form4797.component.css'] })
export class Form4797Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ein: [''], description: [''], dateAcquired: [''], dateSold: [''], salesPrice: [0], costBasis: [0], expensesSale: [0], gainLoss: [{ value: 0, disabled: true }], ordinaryGain: [0], ordinaryLoss: [0], netOrdinary: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ gainLoss: ((Number(v.salesPrice) || 0) - (Number(v.costBasis) || 0) - (Number(v.expensesSale) || 0)), netOrdinary: (Number(v.ordinaryGain) || 0) - (Number(v.ordinaryLoss) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 4797 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}