import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-3468',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form3468.component.html',
    styleUrls: ['./form3468.component.css']
})
export class Form3468Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            applicantName: [''], ein: [''], projectName: [''], projectLocation: [''],
            qualifiedInvestment: [0], creditPercentage: [0.2], creditAmount: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const credit = (Number(v.qualifiedInvestment) || 0) * (Number(v.creditPercentage) || 0);
        this.taxForm.patchValue({ creditAmount: credit }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 3468 Submitted', this.taxForm.getRawValue()); }
}