import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-4562', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form4562.component.html', styleUrls: ['./form4562.component.css'] })
export class Form4562Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ein: [''], descriptionProperty: [''], datePlaced: [''], costBasis: [0], section179: [0], recoveryPeriod: [0], method: [''], deduction: [{ value: 0, disabled: true }], qualifiedProperty: [0], specialAllowance: [0], section179Cost: [0], section179Limit: [0], section179Deduction: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ deduction: (Number(v.costBasis) || 0) - (Number(v.section179) || 0), section179Deduction: Math.min((Number(v.section179Cost) || 0), (Number(v.section179Limit) || 0)) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 4562 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}