import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-8862',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form8862.component.html',
    styleUrls: ['./form8862.component.css']
})
export class Form8862Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], eicClaimed: [0], earnedIncome: [0], investmentIncome: [0], eicAmount: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const invIncomeLimit = 11500;
        const eicMax = 7630;
        if ((Number(v.investmentIncome) || 0) <= 11500) {
            const credit = (Number(v.eicClaimed) || 0) > 0 ? Math.min(eicMax, (Number(v.earnedIncome) || 0) * 0.0765) : 0;
            this.taxForm.patchValue({ eicAmount: credit }, { emitEvent: false });
        }
    }

    onSubmit(): void { console.log('Form 8862 Submitted', this.taxForm.getRawValue()); }
}