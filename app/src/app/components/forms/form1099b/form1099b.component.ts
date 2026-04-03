import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../../services/tax-data.service';
import { ChatFormsComponent } from '../chatforms/chatforms.component';

@Component({
    selector: 'app-form-1099b',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1099b.component.html',
    styleUrls: ['./form1099b.component.css']
})
export class Form1099bComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            payerName: [''],
            tin: [''],
            recipientTIN: [''],
            recipientName: [''],
            recipientAddress: [''],
            recipientCityZip: [''],
            description: [''],
            dateAcquired: [''],
            dateSold: [''],
            proceeds: [0],
            costBasis: [0],
            accruedMarketDiscount: [0],
            washSaleLoss: [0],
            gainType: ['short'],
            noncoveredSecurity: [false],
            federalWithheld: [0],
            lossNotAllowed: [false],
            proceedsType: ['net'],
            lossNotAllowedBox12: [false],
            basisReportedToIRS: [false],
            bartering: [0],
            gainLoss: [{ value: 0, disabled: true }]
        });

        // Effect for dynamic calculation
        this.taxForm.valueChanges.subscribe(() => {
            const v = this.taxForm.getRawValue();
            const calcGain = (Number(v.proceeds) || 0) - (Number(v.costBasis) || 0) - (Number(v.washSaleLoss) || 0);
            this.taxForm.patchValue({
                gainLoss: calcGain
            }, { emitEvent: false });
            
            // Auto-saving strategy
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
        }
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 1099-B Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
