import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8889',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8889.component.html',
    styleUrls: ['./form8889.component.css']
})
export class Form8889Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    selfOnlyLimit2026 = 4300;
    familyLimit2026 = 8550;
    catchUp50Plus = 1000;

    nereaAdvice = {
        part1: 'Las contribuciones a HSA deducibles reducen tu ingreso gravable. Para 2026: Individual $4,300, Familia $8,550. Si tienes 55+, puedes contribuir $1,000 extra.',
        part2: 'Los retiros por gastos médicos calificados son libres de impuestos. Guarda todos los recibos médicos para demostrar que los fondos se usaron correctamente.',
        part3: 'Si tienes seguro médico de alto deductible (HDHP), puedes contribute a un HSA. Verifica que tu plan califique como HDHP.',
        part4: 'Un HSA es triplemente ventajoso: contribución deducible, crecimiento libre de impuestos, y retiros exentos para gastos médicos calificados.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Part I - HSA Contributions
            hsaContributor: [''],
            coveredByHDHP: ['Yes'],
            selfOnlyOrFamily: ['selfOnly'],
            hsaContribution: [0],
            employerContribution: [0],
            totalContribution: [0],
            contributionLimit: [4300],
            excessContribution: [0],

            // Part II - HSA Distributions
            distributionsForMedical: [0],
            distributionsOther: [0],
            totalDistributions: [0],
            taxFreeAmount: [0],
            taxableAmount: [0],

            // Part III - HSA Ownership
            hsaBalanceEnd: [0],
            hsaBalanceEndYear: [0],
            investmentEarnings: [0],

            // Part IV - Tables
            table1Completed: ['No'],
            table2Completed: ['No'],

            // Additional
            spouseContribution: [0],
            age55CatchUp: [0]
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
        
        const limit = v.selfOnlyOrFamily === 'selfOnly' ? this.selfOnlyLimit2026 : this.familyLimit2026;
        const catchUp = v.age55CatchUp > 0 ? this.catchUp50Plus : 0;
        const totalLimit = limit + catchUp;
        
        const totalContrib = (Number(v.hsaContribution) || 0) + (Number(v.employerContribution) || 0);
        const excess = Math.max(0, totalContrib - totalLimit);
        
        const taxFree = Math.min(Number(v.distributionsForMedical) || 0, Number(v.distributionsForMedical) || 0);
        const taxable = Math.max(0, Number(v.distributionsOther) || 0);

        this.taxForm.patchValue({
            contributionLimit: totalLimit,
            totalContribution: totalContrib,
            excessContribution: excess,
            totalDistributions: (Number(v.distributionsForMedical) || 0) + (Number(v.distributionsOther) || 0),
            taxFreeAmount: taxFree,
            taxableAmount: taxable
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 8889 Submitted', this.taxForm.getRawValue());
    }
}