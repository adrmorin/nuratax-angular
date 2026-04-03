import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1065',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1065.component.html',
    styleUrls: ['./form1065.component.css']
})
export class Form1065Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 1065 es la declaración informativa de una sociedad. Las sociedades no pagan impuestos; sus ingresos y deducciones se pasan a los socios.',
        k1: 'Cada socio recibe un Schedule K-1 que reporta su porción de ingresos, deducciones, y créditos. Usa esta información para tu declaración individual.',
        filing: 'El plazo es el 15 de marzo para sociedades de año calendario. Las sociedades deben presentar electrónicamente si tienen más de 10 socios.',
        estimated: 'Los socios con ingresos por trabajo por cuenta propia de la sociedad deben pagar impuestos estimados trimestrales.',
        info: 'La sociedad debe reportar información detallada sobre operaciones, activos, y transacciones de miembros.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Partnership Information
            partnershipName: [''],
            ein: [''],
            principalActivity: [''],
            activityCode: [''],
            numberOfPartners: [0],

            // Income
            grossReceipts: [0],
            grossRentals: [0],
            grossRoyalties: [0],
            interestIncome: [0],
            dividendIncome: [0],
            grossTrading: [0],
            otherIncome: [0],
            totalIncome: [0],

            // Deductions
            compensationOfficers: [0],
            salariesWages: [0],
            guaranteedPayments: [0],
            rentals: [0],
            taxesLicenses: [0],
            interestPaid: [0],
            depreciation: [0],
            depletion: [0],
            retirementPlans: [0],
            otherDeductions: [0],
            totalDeductions: [0],

            // Net
            ordinaryIncome: [0],
            portfolioIncome: [0],
            netCapitalGain: [0],
            netSection1231Gain: [0],
            otherItems: [0],

            // Tax Credits
            generalBusinessCredit: [0],
            lowIncomeHousingCredit: [0],
            otherCredits: [0],

            // Additional
            endingYearAssets: [0],
            cashPropertyDebt: [0]
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
        
        const totalIncome = (Number(v.grossReceipts) || 0) + (Number(v.grossRentals) || 0) + 
            (Number(v.grossRoyalties) || 0) + (Number(v.interestIncome) || 0) + 
            (Number(v.dividendIncome) || 0) + (Number(v.otherIncome) || 0);
        
        const totalDeductions = (Number(v.compensationOfficers) || 0) + (Number(v.salariesWages) || 0) +
            (Number(v.guaranteedPayments) || 0) + (Number(v.rentals) || 0) + (Number(v.taxesLicenses) || 0) +
            (Number(v.interestPaid) || 0) + (Number(v.depreciation) || 0) + (Number(v.otherDeductions) || 0);
        
        const ordinaryIncome = totalIncome - totalDeductions;

        this.taxForm.patchValue({
            totalIncome: totalIncome,
            totalDeductions: totalDeductions,
            ordinaryIncome: ordinaryIncome
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 1065 Submitted', this.taxForm.getRawValue());
    }
}