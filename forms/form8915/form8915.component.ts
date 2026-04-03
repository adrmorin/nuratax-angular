import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-8915',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form8915.component.html',
    styleUrls: ['./form8915.component.css']
})
export class Form8915Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], yearOfLoss: [2026], disasterType: [''],
            totalLoss: [0], amountPreviouslyUsed: [0], amountThisYear: [0], remainingAmount: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const remaining = (Number(v.totalLoss) || 0) - (Number(v.amountPreviouslyUsed) || 0) - (Number(v.amountThisYear) || 0);
        this.taxForm.patchValue({ remainingAmount: remaining }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 8915 Submitted', this.taxForm.getRawValue()); }
}