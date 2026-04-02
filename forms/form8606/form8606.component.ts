import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8606',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8606.component.html',
    styleUrls: ['./form8606.component.css']
})
export class Form8606Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    traditionalLimit2026 = 7000;
    rothLimit2026 = 7000;

    nereaAdvice = {
        part1: 'Mantén registros precisos de las contribuciones no deducibles. Esto evita la doble tributación cuando se toman distribuciones.',
        part2: 'Para 2026, los límites de ingresos para Roth han aumentado. Solteros: $150,000-$165,000; Casados: $236,000-$246,000.',
        part3: 'Las conversiones se gravan en el año de conversión, pero los ganancias crecen libre de impuestos. Aplica la regla de 5 años.',
        part4: 'Las transacciones prohibidas con activos de IRA pueden descalificar todo el IRA y activar tributación inmediata.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Part I - Traditional IRA Contributions
            totalTraditionalContributions: [0],
            deductibleContributions: [0],
            nondeductibleContributions: [0],
            priorYearBasis: [0],
            totalBasisAfter: [{ value: 0, disabled: true }],

            // Part II - Roth IRA Contributions
            rothContributions: [0],
            rothContributionLimit: [7000],
            modifiedAGI: [0],
            rothLimitReduced: [0],
            rothContributionsIfNotFull: [0],

            // Part III - Conversions
            amountConverted: [0],
            amountIncludible: [0],
            basisInConverted: [0],
            taxableAmount: [{ value: 0, disabled: true }],

            // Part IV - Recharacterizations
            traditionalRecharToRoth: [0],
            rothRecharToTraditional: [0],
            netRechar: [0],

            // Part V - Distributions
            totalDistributionsTraditional: [0],
            amountPreviouslyTaxed: [0],
            taxableAmountDistribution: [{ value: 0, disabled: true }],

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

        const totalBasisAfter = (Number(v.nondeductibleContributions) || 0) + (Number(v.priorYearBasis) || 0);
        
        const taxableConversion = (Number(v.amountConverted) || 0) - (Number(v.basisInConverted) || 0);
        
        const taxableDistribution = (Number(v.totalDistributionsTraditional) || 0) - (Number(v.amountPreviouslyTaxed) || 0);

        this.taxForm.patchValue({
            totalBasisAfter: totalBasisAfter,
            taxableAmount: taxableConversion,
            taxableAmountDistribution: taxableDistribution
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 8606 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
