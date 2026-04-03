import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-5471',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form5471.component.html',
    styleUrls: ['./form5471.component.css']
})
export class Form5471Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    nereaAdvice = {
        part1: 'El Form 5471 es requerido para estadounidenses con 10%+ de acciones en corporaciones extranjeras. El incumplimiento activa multas de $10,000.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            personName: [''], ssn: [''],
            corpName: [''], corpEIN: [''],
            country: [''], foreignAddress: [''],
            stockOwned: [0], votingPower: [0], taxYearEnd: [''],
            grossReceipts: [0], costGoodsSold: [0], grossProfit: [{ value: 0, disabled: true }],
            otherIncome: [0], totalDeductions: [0], taxableIncome: [{ value: 0, disabled: true }],
            totalAssets: [0], totalLiabilities: [0], totalEquity: [{ value: 0, disabled: true }],
            earningsInvested: [0], taxPreviouslyPaid: [0]
        });

        this.taxForm.valueChanges.subscribe(() => {
            this.calculateValues();
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
            this.calculateValues();
        }
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        this.taxForm.patchValue({
            grossProfit: (Number(v.grossReceipts) || 0) - (Number(v.costGoodsSold) || 0),
            taxableIncome: ((Number(v.grossReceipts) || 0) - (Number(v.costGoodsSold) || 0) + (Number(v.otherIncome) || 0)) - (Number(v.totalDeductions) || 0),
            totalEquity: (Number(v.totalAssets) || 0) - (Number(v.totalLiabilities) || 0)
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 5471 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}