import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1040sc',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1040sc.component.html',
    styleUrls: ['./form1040sc.component.css']
})
export class Form1040scComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    standardMileageRate2026 = 0.70;

    nereaAdvice = {
        part1: 'Reporte sus ingresos brutos correctamente. Reconcilie con los formularios 1099-K recibidos para evitar señales rojas del IRS en 2026.',
        part2: 'Los gastos de negocio deben tener recibos y ser ordinarios y necesarios. Evite deducciones excesivas que pueden activar auditorías.',
        part3: 'El costo de bienes vendidos afecta directamente su ganancia bruta. Mantenga inventario detallado si vende productos.',
        part4: 'Para deducciones de vehículo, lleve un registro de millas diario. El método estándar usa 70 centavos por milla en 2026.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Owner Info
            ownerName: [''],
            ssn: [''],
            ein: [''],
            businessType: [''],

            // Part I - Income
            grossReceipts: [0],
            returnsAllowances: [0],
            grossProfit: [{ value: 0, disabled: true }],
            costOfGoodsSold: [0],
            grossIncome: [{ value: 0, disabled: true }],
            otherIncome: [0],
            totalIncome: [{ value: 0, disabled: true }],

            // Part II - Expenses
            advertising: [0],
            carTruck: [0],
            commissionsFees: [0],
            contractLabor: [0],
            depreciation: [0],
            employeeBenefits: [0],
            insurance: [0],
            interestMortgage: [0],
            interestOther: [0],
            legalProfessional: [0],
            officeExpense: [0],
            pensionProfitSharing: [0],
            rentLease: [0],
            repairsMaintenance: [0],
            supplies: [0],
            taxesLicenses: [0],
            travel: [0],
            meals: [0],
            utilities: [0],
            wages: [0],
            otherExpenses: [0],
            totalExpenses: [{ value: 0, disabled: true }],
            netProfit: [{ value: 0, disabled: true }],

            // Part III - Cost of Goods Sold
            beginningInventory: [0],
            purchases: [0],
            costOfLabor: [0],
            otherCosts: [0],
            cogsTotal: [{ value: 0, disabled: true }],
            endingInventory: [0],
            
            // Part IV - Vehicle
            vehicleDate: [''],
            usedPersonal: [false],
            businessMiles: [0],
            commutingMiles: [0],
            otherMiles: [0],
            totalVehicleMiles: [0],
            businessMilesInput: [0],
            averageVehicleCost: [0],

            // Part V - Other Expenses
            otherExpense1: [0],
            otherExpense2: [0],
            otherExpense3: [0],
            otherExpense4: [0],
            totalOtherExpenses: [{ value: 0, disabled: true }]
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

        // Part I calculations
        const grossProfit = (Number(v.grossReceipts) || 0) - (Number(v.returnsAllowances) || 0);
        const grossIncome = grossProfit - (Number(v.costOfGoodsSold) || 0);
        const totalIncome = grossIncome + (Number(v.otherIncome) || 0);

        // Part II calculations
        const expenseFields = [
            'advertising', 'carTruck', 'commissionsFees', 'contractLabor',
            'depreciation', 'employeeBenefits', 'insurance', 'interestMortgage',
            'interestOther', 'legalProfessional', 'officeExpense', 'pensionProfitSharing',
            'rentLease', 'repairsMaintenance', 'supplies', 'taxesLicenses',
            'travel', 'meals', 'utilities', 'wages', 'otherExpenses'
        ];
        
        const totalExpenses = expenseFields.reduce((sum, field) => {
            return sum + (Number(this.taxForm.get(field)?.value) || 0);
        }, 0);

        const netProfit = totalIncome - totalExpenses;

        // Part III calculations
        const cogsTotal = (Number(v.beginningInventory) || 0) + 
                         (Number(v.purchases) || 0) + 
                         (Number(v.costOfLabor) || 0) + 
                         (Number(v.otherCosts) || 0);
        const cogs = cogsTotal - (Number(v.endingInventory) || 0);

        // Part V calculations
        const totalOtherExpenses = (Number(v.otherExpense1) || 0) +
                                   (Number(v.otherExpense2) || 0) +
                                   (Number(v.otherExpense3) || 0) +
                                   (Number(v.otherExpense4) || 0);

        // Part IV - Total miles
        const totalMiles = (Number(v.businessMiles) || 0) +
                          (Number(v.commutingMiles) || 0) +
                          (Number(v.otherMiles) || 0);

        this.taxForm.patchValue({
            grossProfit: grossProfit,
            costOfGoodsSold: cogs,
            grossIncome: grossIncome,
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
            netProfit: netProfit,
            cogsTotal: cogsTotal,
            totalOtherExpenses: totalOtherExpenses,
            totalVehicleMiles: totalMiles
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Schedule C Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
