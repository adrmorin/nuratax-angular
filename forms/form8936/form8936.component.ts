import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-8936',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form8936.component.html',
    styleUrls: ['./form8936.component.css']
})
export class Form8936Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            vehicleMake: [''], vehicleModel: [''], vehicleYear: [2026], vin: [''],
            purchaseDate: [''], purchasePrice: [0], businessUsePercent: [0], creditAmount: [0],
            personalUseCredit: [0], businessCredit: [0], totalCredit: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const credit = Math.min(7500, (Number(v.purchasePrice) || 0) * 0.3);
        const personalCredit = credit * ((Number(v.businessUsePercent) || 0) / 100);
        this.taxForm.patchValue({ creditAmount: credit, personalUseCredit: personalCredit }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 8936 Submitted', this.taxForm.getRawValue()); }
}