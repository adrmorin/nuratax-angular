import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-3520a',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form3520a.component.html',
    styleUrls: ['./form3520a.component.css']
})
export class Form3520aComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        part1: 'Los fideicomisos extranjeros con propietarios estadounidenses deben reportarse anualmente. El incumplimiento puede resultar en multas significativas.',
        part2: 'El fiduciario debe proporcionar información completa sobre la distribución de ingresos. Cualquier omisión activa penalidades.',
        part3: 'Reporte todos los ingresos del fideicomiso, incluyendo intereses, dividendos, regalías e ingresos inmobiliarios. La omisión de ingresos activa señales de auditoría.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Trust Info
            trustName: [''],
            ssn: [''],
            ein: [''],
            foreignAddress: [''],

            // Part I - U.S. Owner
            ownerName1: [''],
            ownerSSN1: [''],
            ownerAddress1: [''],
            ownershipPercent: [0],

            // Part II - Fiduciary
            fiduciaryName: [''],
            fiduciaryAddress: [''],
            fiduciaryEIN: [''],

            // Part III - Trust Income
            interestIncome: [0],
            dividendIncome: [0],
            royaltyIncome: [0],
            realEstateIncome: [0],
            otherIncome: [0],
            totalTrustIncome: [{ value: 0, disabled: true }],
            distributionsUS: [0],
            distributionsForeign: [0],

            // Part IV - Trust Assets
            totalTrustAssets: [0],
            usAssetValue: [0],
            foreignAssetValue: [0],

            // Part V - Transactions
            saleProperty: [false],
            loanTransaction: [false],
            transferToTrust: [false],
            distributionFromTrust: [false]
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

        const totalTrustIncome = (Number(v.interestIncome) || 0) +
                                  (Number(v.dividendIncome) || 0) +
                                  (Number(v.royaltyIncome) || 0) +
                                  (Number(v.realEstateIncome) || 0) +
                                  (Number(v.otherIncome) || 0);

        this.taxForm.patchValue({
            totalTrustIncome: totalTrustIncome
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 3520-A Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
