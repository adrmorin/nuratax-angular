import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-8582', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form8582.component.html', styleUrls: ['./form8582.component.css'] })
export class Form8582Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ssn: [''], totalLoss: [0], totalGains: [0], netLossGain: [{ value: 0, disabled: true }], incomeWages: [0], deductionAllowed: [0], carryforward: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ netLossGain: (Number(v.totalLoss) || 0) - (Number(v.totalGains) || 0), carryforward: ((Number(v.totalLoss) || 0) - (Number(v.totalGains) || 0)) - (Number(v.deductionAllowed) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 8582 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}