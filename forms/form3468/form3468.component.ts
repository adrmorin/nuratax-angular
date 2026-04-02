import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-3468',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form3468.component.html',
    styleUrls: ['./form3468.component.css']
})
export class Form3468Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        part1: 'El crédito de rehabilitación puede ser hasta 30% para edificios históricos certificados. Para 2026, asegura que los gastos de rehabilitación estén debidamente documentados.',
        part2: 'La energía solar, eólica y geotérmica pueden calificar para 30% o más bajo la Ley de Reducción de Inflación (IRA). Verifica los requisitos de localización.',
        part3: 'El crédito de manufactura avanzada bajo Sección 48D está disponible para propiedad calificada puesta en servicio después de 2027.',
        part4: 'Los proyectos deben estar registrados en el portal IRS Energy Credit Online para reclamar créditos de electricidad limpia.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Part I - Investment Credit Carried Forward
            carryforwardPrior: [0],
            currentYearCredit: [0],

            // Part II - Rehabilitation Credit
            qualifiedRehabBuildings: [0],
            qualifiedRehabHistoric: [0],
            totalRehabCredit: [{ value: 0, disabled: true }],
            rehabCreditPercentage: [30],
            rehabilitationCredit: [{ value: 0, disabled: true }],

            // Part III - Energy Credit
            qualifiedEnergyProperty: [0],
            energyPropertyBasis: [0],
            energyCredit: [{ value: 0, disabled: true }],
            energyCreditPercentage: [30],

            // Part IV - Advanced Manufacturing Investment Credit
            advancedMfgBasis: [0],
            advancedMfgPercentage: [25],
            advancedMfgCredit: [{ value: 0, disabled: true }],

            // Part V - Clean Electricity Investment Credit
            cleanElectricityBasis: [0],
            cleanElectricityPercentage: [30],
            cleanElectricityCredit: [{ value: 0, disabled: true }],

            // Part VI - Other Credits
            otherInvestmentCredits: [0],
            totalInvestmentCredit: [{ value: 0, disabled: true }],

            // Part VII - Apply Credit
            creditCarriedForward: [0],
            creditUsedCurrent: [0],
            amountCredited8621: [0],

            // Owner Info
            ownerName: [''],
            ssn: ['']
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

        const totalRehab = (Number(v.qualifiedRehabBuildings) || 0) * 0.30 +
            (Number(v.qualifiedRehabHistoric) || 0) * 0.20;

        const rehabCredit = totalRehab;

        const energyCredit = (Number(v.energyPropertyBasis) || 0) * (Number(v.energyCreditPercentage) || 0) / 100;

        const advancedMfgCredit = (Number(v.advancedMfgBasis) || 0) * (Number(v.advancedMfgPercentage) || 0) / 100;

        const cleanElectricityCredit = (Number(v.cleanElectricityBasis) || 0) * (Number(v.cleanElectricityPercentage) || 0) / 100;

        const totalCredit = rehabCredit + energyCredit + advancedMfgCredit + cleanElectricityCredit +
            (Number(v.otherInvestmentCredits) || 0);

        this.taxForm.patchValue({
            totalRehabCredit: totalRehab,
            rehabilitationCredit: rehabCredit,
            energyCredit: energyCredit,
            advancedMfgCredit: advancedMfgCredit,
            cleanElectricityCredit: cleanElectricityCredit,
            totalInvestmentCredit: totalCredit
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 3468 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
