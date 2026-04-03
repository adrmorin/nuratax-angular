import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1099int',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1099int.component.html',
    styleUrls: ['./form1099int.component.css']
})
export class Form1099INTComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            payerName: [''], payerTin: [''], recipiName: [''], recipiTin: [''],
            interestIncome: [0], earlyWithdrawal: [0], originalIssueDiscount: [0], usSavingsBonds: [0],
            taxExempt: [0], specifiedTax: [0], marketDiscount: [0], bondPremium: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1099-INT Submitted', this.taxForm.getRawValue()); }
}