import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-schedule-k',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './schedulek.component.html',
    styleUrls: ['./schedulek.component.css']
})
export class ScheduleKComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        general: 'Schedule K es un resumen de la información de ingresos, deducciones y créditos de la sociedad. Cada socio reporta su parte en su declaración individual.',
        income: 'Los ingresos ordinarios incluyen ingresos por actividades de la sociedad sujetos a impuestos sobre el trabajo por cuenta propia.',
        deductions: 'Las deducciones de la sociedad no pueden reducir el ingreso ordinario del socio por debajo de cero.',
        credits: 'Los créditos de la sociedad se asignan a los socios proporcionalmente a su participación en las ganancias.',
        basis: 'Mantén registro de tu base ajustada en la sociedad para determinar distribuciones gravables correctamente.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Part I - Income
            ordinaryBusinessIncome: [0],
            grossReceiptsSales: [0],
            costOfGoodsSold: [0],
            otherIncome: [0],

            // Part II - Deductions
            guaranteedPayments: [0],
            salariesAndWages: [0],
            rents: [0],
            taxesAndLicenses: [0],
            interestExpense: [0],
            depreciation: [0],
            depletion: [0],
            retirementPlans: [0],
            otherDeductions: [0],

            // Part III - Other Items
            section179Deduction: [0],
            section179ATADeduction: [0],
            charitableContributions: [0],
            investmentInterest: [0],
            section163nInterest: [0],
            qualifiedBusinessIncome: [0],
            netCapitalGain: [0],
            section199A: [0],

            // Credits
            foreignTaxCredit: [0],
            generalBusinessCredit: [0],
            minimumTaxCredit: [0],
            otherCredits: [0],

            // Additional Items
            selfEmploymentEarnings: [0],
            selfEmploymentDeductions: [0],
            incomeNotFromScheduleM3: [0],

            // Partner Info
            partnerName: [''],
            ein: [''],
            partnershipName: ['']
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

        const totalIncome = (Number(v.ordinaryBusinessIncome) || 0) + (Number(v.otherIncome) || 0);
        const totalDeductions = (Number(v.guaranteedPayments) || 0) + (Number(v.salariesAndWages) || 0) +
            (Number(v.rents) || 0) + (Number(v.taxesAndLicenses) || 0) + (Number(v.interestExpense) || 0) +
            (Number(v.depreciation) || 0) + (Number(v.retirementPlans) || 0) + (Number(v.otherDeductions) || 0);

        this.taxForm.patchValue({
            grossReceiptsSales: totalIncome,
            costOfGoodsSold: totalIncome - totalDeductions
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Schedule K Submitted', this.taxForm.getRawValue());
    }
}