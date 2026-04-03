import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-2210',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form2210.component.html',
    styleUrls: ['./form2210.component.css']
})
export class Form2210Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], filingStatus: ['single'], totalTax: [0], withholding: [0], requiredPayment: [0], underpayment: [0], penalty: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const under = Math.max(0, (Number(v.totalTax) || 0) - (Number(v.withholding) || 0));
        const penalty = under * 0.05 * 4;
        this.taxForm.patchValue({ underpayment: under, penalty: penalty }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 2210 Submitted', this.taxForm.getRawValue()); }
}