import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-2441',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form2441.component.html',
    styleUrls: ['./form2441.component.css']
})
export class Form2441Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            providerName: [''], providerTin: [''], dependent1Name: [''], dependent1SSN: [''],
            dependent1Expenses: [0], dependent1Qualified: 'Yes', dependent2Name: [''], dependent2SSN: [''],
            dependent2Expenses: [0], dependent2Qualified: 'Yes', totalExpenses: [0], creditPercentage: [0.35],
            maxCredit: [0], earnedIncome: [0], creditAmount: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const totalExp = (Number(v.dependent1Expenses) || 0) + (Number(v.dependent2Expenses) || 0);
        const maxCredit = Math.min(3000, totalExp) * (Number(v.creditPercentage) || 0);
        const credit = Math.min(maxCredit, (Number(v.earnedIncome) || 0));
        this.taxForm.patchValue({ totalExpenses: totalExp, maxCredit: maxCredit, creditAmount: credit }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 2441 Submitted', this.taxForm.getRawValue()); }
}