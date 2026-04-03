import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../../services/tax-data.service';
import { ChatFormsComponent } from '../chatforms/chatforms.component';

@Component({
    selector: 'app-schedule-c',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './schedule-c.component.html',
    styleUrls: ['./schedule-c.component.css']
})
export class ScheduleCComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            // Header
            proprietorName: [''],
            ssn: [''],
            businessCode: [''],
            businessName: [''],
            ein: [''],
            businessAddress: [''],

            // Questions
            accountingMethod: ['cash'],
            materiallyParticipated: [true],
            startedBusiness: [false],
            forms1099Filed: [false],

            // Part I: Income
            grossReceipts: [0],
            returnsAllowances: [0],
            cogs: [0],
            otherIncome: [0],
            grossIncome: [{ value: 0, disabled: true }],

            // Part II: Expenses
            advertising: [0],
            carExpenses: [0],
            commissions: [0],
            contractLabor: [0],
            depletion: [0],
            depreciation: [0],
            employeeBenefits: [0],
            insurance: [0],
            interestMortgage: [0],
            interestOther: [0],
            legalPro: [0],
            officeExpense: [0],
            pensionProfit: [0],
            rentVehicles: [0],
            rentOther: [0],
            repairs: [0],
            supplies: [0],
            taxLicenses: [0],
            travel: [0],
            meals: [0],
            utilities: [0],
            wages: [0],
            otherExpenses: [0],
            homeBusinessUse: [0],

            totalExpenses: [{ value: 0, disabled: true }],
            netProfit: [{ value: 0, disabled: true }]
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
        }

        this.taxForm.valueChanges.subscribe(() => {
            const v = this.taxForm.getRawValue();
            
            // Income calculation
            const netReceipts = (Number(v.grossReceipts) || 0) - (Number(v.returnsAllowances) || 0);
            const grossProfit = netReceipts - (Number(v.cogs) || 0);
            const grossIncome = grossProfit + (Number(v.otherIncome) || 0);

            // Expense calculation
            const expensesList = [
                v.advertising, v.carExpenses, v.commissions, v.contractLabor, v.depletion,
                v.depreciation, v.employeeBenefits, v.insurance, v.interestMortgage, v.interestOther,
                v.legalPro, v.officeExpense, v.pensionProfit, v.rentVehicles, v.rentOther,
                v.repairs, v.supplies, v.taxLicenses, v.travel, v.meals,
                v.utilities, v.wages, v.otherExpenses, v.homeBusinessUse
            ];
            
            const totalExpenses = expensesList.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
            const netProfit = grossIncome - totalExpenses;

            this.taxForm.patchValue({
                grossIncome: grossIncome,
                totalExpenses: totalExpenses,
                netProfit: netProfit
            }, { emitEvent: false });

            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    onSubmit(): void {
        console.log('Schedule C submitted', this.taxForm.getRawValue());
    }
}
