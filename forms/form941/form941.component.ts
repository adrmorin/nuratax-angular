import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-941',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form941.component.html',
    styleUrls: ['./form941.component.css']
})
export class Form941Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    socialSecurityRate = 0.124;
    medicareRate = 0.0145;
    additionalMedicare = 0.009;

    nereaAdvice = {
        purpose: 'Form 941 es la declaración trimestral de impuestos federales del empleador. Reporta salarios sujetos a impuestos de Seguridad Social y Medicare.',
        schedule: 'Los plazos son: 30 de abril (Q1), 31 de julio (Q2), 31 de octubre (Q3), y 31 de enero (Q4).',
        rates: 'Para 2026: Seguridad Social 6.2% del empleado + 6.2% del empleador (hasta $168,600). Medicare 1.45% cada parte sin límite.',
        deposit: 'Los depósitos son mensuales o quincenales dependiendo del monto de impuestos acumulados. Usa el Formulario 941 para reconcilear.',
        credit: 'Puedes reclamar créditos por pagos familiares calificados,斯基 trabajo, y otros créditos de retención de impuestos.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Employer Info
            employerName: [''],
            ein: [''],
            quarter: ['Q1'],
            quarterYear: [2026],

            // Wages
            wagesSubjectToSS: [0],
            tipsSubjectToSS: [0],
            wagesSubjectToMedicare: [0],

            // Tax Calculation
            socialSecurityTax: [0],
            socialSecurityTaxOnTips: [0],
            medicareTax: [0],
            socialSecurityTaxWithheld: [0],
            medicareTaxWithheld: [0],

            // Totals
            totalTaxes: [0],
            depositsMade: [0],
            balanceDue: [0],
            overpayment: [0],

            // Credits
            federalIncomeTaxWithheld: [0],
            sickPayCredit: [0],
            dependentCareCredit: [0],
            otherCredits: [0],

            // Adjustments
            adjustmentForTips: [0],
            adjustmentForFractionalPart: [0],
            totalAdjustment: [0]
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
        
        const ssTax = (Number(v.wagesSubjectToSS) || 0) * this.socialSecurityRate;
        const medicareTax = (Number(v.wagesSubjectToMedicare) || 0) * this.medicareRate;
        
        const totalTaxes = ssTax + medicareTax + (Number(v.socialSecurityTaxOnTips) || 0);
        const balanceDue = totalTaxes - (Number(v.depositsMade) || 0);

        this.taxForm.patchValue({
            socialSecurityTax: ssTax,
            medicareTax: medicareTax,
            totalTaxes: totalTaxes,
            balanceDue: balanceDue > 0 ? balanceDue : 0,
            overpayment: balanceDue < 0 ? Math.abs(balanceDue) : 0
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 941 Submitted', this.taxForm.getRawValue());
    }
}