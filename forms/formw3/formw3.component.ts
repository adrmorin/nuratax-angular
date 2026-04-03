import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-w3',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './formw3.component.html',
    styleUrls: ['./formw3.component.css']
})
export class FormW3Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    constructor() {
        this.taxForm = this.fb.group({
            ein: [''], employerName: [''], employerAddress: [''],
            totalForms: [0], totalWages: [0], totalSSWages: [0], totalSSTax: [0],
            totalMedicareWages: [0], totalMedicareTax: [0], totalWithholding: [0],
            stateTax: [''], stateTotalWages: [0], stateIncomeTax: [0],
            localTax: [''], localTotalWages: [0], localIncomeTax: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form W-3 Submitted', this.taxForm.getRawValue()); }
}