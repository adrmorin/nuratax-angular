import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1116',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1116.component.html',
    styleUrls: ['./form1116.component.css']
})
export class Form1116Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], country: [''], grossIncome: [0], totalDeductions: [0], netIncome: [0],
            foreignTaxPaid: [0], foreignTaxCredit: [0], taxableIncome: [0], totalTax: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const net = (Number(v.grossIncome) || 0) - (Number(v.totalDeductions) || 0);
        const ratio = (Number(v.taxableIncome) || 0) > 0 ? net / (Number(v.taxableIncome) || 1) : 0;
        const credit = Math.min((Number(v.foreignTaxPaid) || 0), (Number(v.totalTax) || 0) * ratio);
        this.taxForm.patchValue({ netIncome: net, foreignTaxCredit: credit }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1116 Submitted', this.taxForm.getRawValue()); }
}