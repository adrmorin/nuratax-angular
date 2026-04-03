import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1099oid',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1099oid.component.html',
    styleUrls: ['./form1099oid.component.css']
})
export class Form1099OIDComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            payerName: [''], payerTin: [''], recipiName: [''], recipiTin: [''],
            originalIssueDiscount: [0], otherPeriodically: [0], usSavingsBonds: [0],
            earlyWithdrawal: [0], adjustment: [0], taxExempt: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1099-OID Submitted', this.taxForm.getRawValue()); }
}