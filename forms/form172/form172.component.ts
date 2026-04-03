import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-172',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form172.component.html',
    styleUrls: ['./form172.component.css']
})
export class Form172Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 172 calcula las pérdidas operativas nette (NOL) para individuos, fideicomisos y sucesiones. Las NOL pueden compensarse contra otros ingresos.',
        change: 'Para años fiscales 2021 en adelante, el beneficio de NOL está limitado al 80% del ingreso gravable. No hay arrastre a años anteriores.',
        calculation: 'El cálculo de NOL considera: ingresos brutos menos deducciones, incluyendo deducciones por trabajo por cuenta propia y deducciones de la línea 12.',
        carryforward: 'Las NOL generadas después de 2020 pueden arrendarse indefinidamente. Las NOL de años anteriores pueden estar sujetas a reglas diferentes.',
        election: 'Puedes renunciar al arrastre de NOL (solo para años 2018-2020) para forgo el beneficio.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Taxpayer Information
            taxpayerName: [''],
            ssn: [''],
            taxYear: [2026],

            // Part I - NOL Computation
            grossIncome: [0],
            deductionsAboveLine: [0],
            part1NOL: [{ value: 0, disabled: true }],

            // Part II - Deductions Below the Line
            selfEmploymentDeduction: [0],
            itemizedDeductions: [0],
            qualifiedBusinessIncomeDeduction: [0],
            otherDeductions: [0],
            part2Deductions: [0],

            // Part III - NOL Available This Year
            beginningNOL: [0],
            thisYearNOL: [0],
            totalNOL: [0],

            // Part IV - NOL Deduction
            taxableIncome: [0],
            nolDeduction: [0],
            remainingNOL: [0],

            // Election
            waiveCarryback: ['No']
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
        
        const part1NOL = (Number(v.grossIncome) || 0) - (Number(v.deductionsAboveLine) || 0);
        
        const part2Deductions = (Number(v.selfEmploymentDeduction) || 0) + 
            (Number(v.itemizedDeductions) || 0) + 
            (Number(v.qualifiedBusinessIncomeDeduction) || 0) +
            (Number(v.otherDeductions) || 0);
        
        const totalNOL = (Number(v.beginningNOL) || 0) + part1NOL;
        
        const nolDeduction = Math.min(Number(v.taxableIncome) || 0, totalNOL);
        const remainingNOL = totalNOL - nolDeduction;

        this.taxForm.patchValue({
            part1NOL: part1NOL < 0 ? part1NOL : 0,
            part2Deductions: part2Deductions,
            totalNOL: totalNOL < 0 ? totalNOL : 0,
            nolDeduction: nolDeduction,
            remainingNOL: remainingNOL
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 172 Submitted', this.taxForm.getRawValue());
    }
}