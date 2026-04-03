import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-6251',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form6251.component.html',
    styleUrls: ['./form6251.component.css']
})
export class Form6251Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    thresholdSingle2026 = 232000;
    thresholdMarried2026 = 309000;

    constructor() {
        this.taxForm = this.fb.group({
            filingStatus: ['single'], agi: [0], deductions: [0], taxableIncome: [0],
            scheduleD: [0], partIIITax: [0], totalAMT: [0], exemptionAmount: [0], amtIncome: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const threshold = v.filingStatus === 'single' ? this.thresholdSingle2026 : this.thresholdMarried2026;
        const exemption = Math.max(0, 88100 - 0.25 * Math.max(0, (Number(v.agi) || 0) - threshold));
        const amtIncome = (Number(v.taxableIncome) || 0) + (Number(v.scheduleD) || 0);
        this.taxForm.patchValue({ exemptionAmount: exemption, amtIncome: amtIncome }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 6251 Submitted', this.taxForm.getRawValue()); }
}