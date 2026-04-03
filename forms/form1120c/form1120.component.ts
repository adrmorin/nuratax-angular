import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1120',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1120.component.html',
    styleUrls: ['./form1120.component.css']
})
export class Form1120Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            corpName: [''], ein: [''], state: [''], grossReceipts: [0], costOfGoods: [0], grossProfit: [0],
            totalIncome: [0], deductions: [0], taxableIncome: [0], tax: [0], totalPayments: [0], balanceDue: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const profit = (Number(v.grossReceipts) || 0) - (Number(v.costOfGoods) || 0);
        const income = (Number(v.totalIncome) || 0) - (Number(v.deductions) || 0);
        const balance = (Number(v.tax) || 0) - (Number(v.totalPayments) || 0);
        this.taxForm.patchValue({ grossProfit: profit, taxableIncome: income, balanceDue: balance > 0 ? balance : 0 }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1120 Submitted', this.taxForm.getRawValue()); }
}