import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-5500', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form5500.component.html', styleUrls: ['./form5500.component.css'] })
export class Form5500Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ planName: [''], ein: [''], planNumber: [0], planYear: [''], totalAssets: [0], totalLiabilities: [0], netAssets: [{ value: 0, disabled: true }], totalIncome: [0], totalExpenses: [0], netIncome: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ netAssets: (Number(v.totalAssets) || 0) - (Number(v.totalLiabilities) || 0), netIncome: (Number(v.totalIncome) || 0) - (Number(v.totalExpenses) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 5500 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}