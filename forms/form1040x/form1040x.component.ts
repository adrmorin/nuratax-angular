import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1040x',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1040x.component.html',
    styleUrls: ['./form1040x.component.css']
})
export class Form1040xComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], filingStatus: [''], taxYear: [''],
            reason1: [''], reason2: [''], reason3: [''], reason4: [''], reason5: [''],
            incomeChange: [0], deductionChange: [0], creditChange: [0], taxChange: [0],
            refundAmount: [0], refundMethod: [''], routingNumber: [''], accountNumber: [''],
            accountType: [''], routingTransit: [''], signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1040-X Submitted', this.taxForm.getRawValue()); }

    calculateAmount(): void {
        const v = this.taxForm.getRawValue();
        const totalChange = (Number(v.incomeChange) || 0) + (Number(v.deductionChange) || 0) - (Number(v.creditChange) || 0) - (Number(v.taxChange) || 0);
        this.taxForm.patchValue({ refundAmount: totalChange }, { emitEvent: false });
    }
}