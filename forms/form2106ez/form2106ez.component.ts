import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-2106ez',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form2106ez.component.html',
    styleUrls: ['./form2106ez.component.css']
})
export class Form2106EZComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    mileageRate2026 = 0.70;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], businessMiles: [0], parking: [0], tolls: [0], totalExpenses: [0], amountReimbursed: [0], deductibleAmount: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const mileageDeduction = (Number(v.businessMiles) || 0) * this.mileageRate2026;
        const totalExp = (Number(v.parking) || 0) + (Number(v.tolls) || 0) + mileageDeduction;
        const deductible = Math.max(0, totalExp - (Number(v.amountReimbursed) || 0));
        this.taxForm.patchValue({ totalExpenses: totalExp, deductibleAmount: deductible }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 2106-EZ Submitted', this.taxForm.getRawValue()); }
}