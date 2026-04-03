import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8997',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8997.component.html',
    styleUrls: ['./form8997.component.css']
})
export class Form8997Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 8997 reporta inversiones en Qualified Opportunity Funds (QOF). Se usa para informar al IRS sobre las inversiones realizadas y las ganancias de capital diferidas.',
        deferral: 'Invertir en un QOF te permite diferir las ganancias de capital que reinviertas. El diferimiento dura hasta que vendas la inversión del QOF o hasta 2026.',
        basis: 'Si mantienes la inversión por 5 años, obtienes un aumento del 10% en la base. Si mantienes por 7 años, el aumento es del 15% (para inversiones antes de 2023).',
        reporting: 'Debes reportar las inversiones existentes al inicio y final del año, así como cualquier ganancia de capital diferida por la inversión en el QOF.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Investor Information
            investorName: [''],
            ein: [''],

            // QOF Investment Details
            qofName: [''],
            qofEin: [''],

            // Investment Amounts
            beginningInvestment: [0],
            endingInvestment: [0],
            additionalInvestments: [0],
            withdrawals: [0],

            // Deferred Gain
            deferredCapitalGain: [0],
            originalGainDeferred: [0],
            gainRecognized: [0],

            // Holding Period
            investmentDate: [''],
            yearsHeld: [0],

            // Election
            electionToWaive: ['No']
        });

        this.taxForm.valueChanges.subscribe(() => {
            this.calculateValues();
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
            this.calculateValues();
        }
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const ending = (Number(v.beginningInvestment) || 0) + (Number(v.additionalInvestments) || 0) - (Number(v.withdrawals) || 0);
        
        this.taxForm.patchValue({
            endingInvestment: ending
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 8997 Submitted', this.taxForm.getRawValue());
    }
}