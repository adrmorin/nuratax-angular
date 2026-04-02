import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1120',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1120.component.html',
    styleUrls: ['./form1120.component.css']
})
export class Form1120Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    corporateTaxRate = 0.21;

    nereaAdvice = {
        part1: 'Asegúrate de usar el método correcto de COGS (FIFO, LIFO o costo promedio). Para 2026, revisa los métodos de valoración de inventario para beneficios de flujo de caja.',
        part2: 'La deducción bajo Sección 250 para FDII y GILTI sigue siendo 37.5% para 2026. Verifica los requisitos de elegibilidad.',
        part3: 'Los pagos de impuestos estimados corporativos vencen trimestralmente. Missing deadlines puede resultar en penalidades.',
        part4: 'Los requisitos de reporte de BOI bajo FinCEN aplican a ciertas corporaciones. Asegura cumplimiento con la Ley de Transparencia Corporativa.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Header Information
            name: ['', Validators.required],
            ein: ['', Validators.required],
            address: [''],
            cityStateZip: [''],
            stateOfIncorporation: [''],
            dateIncorporated: [''],
            accountingMethod: ['cash'],

            // Part I - Income
            grossReceipts: [0],
            costOfGoodsSold: [0],
            grossProfit: [{ value: 0, disabled: true }],
            dividendsInclude: [0],
            grossIncome: [{ value: 0, disabled: true }],

            // Part II - Deductions
            deductions: this.fb.group({
                compensationOfficers: [0],
                salariesWages: [0],
                repairsMaintenance: [0],
                badDebts: [0],
                rentLease: [0],
                taxesLicenses: [0],
                interestExpense: [0],
                charitableContributions: [0],
                amortization: [0],
                depreciation: [0],
                advertising: [0],
                pensionPlans: [0],
                employeeBenefits: [0],
                otherDeductions: [0]
            }),
            totalDeductions: [{ value: 0, disabled: true }],
            taxableIncome: [{ value: 0, disabled: true }],

            // Part III - Tax and Payments
            taxLiability: [{ value: 0, disabled: true }],
            federalIncomeTaxPaid: [0],
            overpayment: [0],
            refundAmount: [0],

            // Part IV - Balance Sheet
            assetsBeginning: [0],
            assetsEnding: [0],
            liabilitiesBeginning: [0],
            liabilitiesEnding: [0],
            equityBeginning: [0],
            equityEnding: [0],

            // Part V - Other Information
            domesticProduction: [0],
            qbidDeduction: [0],
            section250Deduction: [0]
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

        const grossProfit = (Number(v.grossReceipts) || 0) - (Number(v.costOfGoodsSold) || 0);
        const grossIncome = grossProfit + (Number(v.dividendsInclude) || 0);

        const d = v.deductions || {};
        const totalDeductions = Object.values(d).reduce((acc: number, val: unknown) => acc + (Number(val) || 0), 0);
        
        const taxableIncome = grossIncome - totalDeductions;
        const taxLiability = taxableIncome > 0 ? taxableIncome * this.corporateTaxRate : 0;

        this.taxForm.patchValue({
            grossProfit: grossProfit,
            grossIncome: grossIncome,
            totalDeductions: totalDeductions,
            taxableIncome: taxableIncome,
            taxLiability: taxLiability
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 1120 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
