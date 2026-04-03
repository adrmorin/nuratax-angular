import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8949',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8949.component.html',
    styleUrls: ['./form8949.component.css']
})
export class Form8949Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 8949 reporta ventas y disposiciones de activos de capital. Se usa para reconciliar los montos reportados en Formularios 1099-B o 1099-S con tu base de costo.',
        shortTerm: 'Las ganancias o pérdidas de activos mantenidos un año o menos son de corto plazo. Se gravan como ingreso ordinario en tu declaración.',
        longTerm: 'Las ganancias de activos mantenidos más de un año son de largo plazo. Las tasas son 0%, 15%, o 20% dependiendo de tu ingreso.',
        basis: 'La base de costo incluye el precio de compra más honorarios de adquisición. Guarda todos los recibos y estados de cuenta.',
        box: 'Usa la caja correcta: (A) corto plazo reportada, (B) corto plazo no reportada, (C) largo plazo reportada, (D) largo plazo no reportada.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Transaction Details
            transactionType: ['A'],
            description: [''],
            dateAcquired: [''],
            dateSold: [''],
            proceeds: [0],
            costBasis: [0],
            adjustment: [0],
            gainOrLoss: [0],

            // Additional Transactions
            transaction2Description: [''],
            transaction2DateAcquired: [''],
            transaction2DateSold: [''],
            transaction2Proceeds: [0],
            transaction2CostBasis: [0],
            transaction2GainOrLoss: [0],

            transaction3Description: [''],
            transaction3DateAcquired: [''],
            transaction3DateSold: [''],
            transaction3Proceeds: [0],
            transaction3CostBasis: [0],
            transaction3GainOrLoss: [0],

            // Totals
            totalProceeds: [0],
            totalCostBasis: [0],
            totalGainOrLoss: [0],

            // Part II - Adjustments
            washSale: [0],
            collectiblesGain: [0],
            section1250Gain: [0],
            otherAdjustments: [0]
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
        
        const gain1 = (Number(v.proceeds) || 0) - (Number(v.costBasis) || 0);
        const gain2 = (Number(v.transaction2Proceeds) || 0) - (Number(v.transaction2CostBasis) || 0);
        const gain3 = (Number(v.transaction3Proceeds) || 0) - (Number(v.transaction3CostBasis) || 0);
        
        const totalProceeds = (Number(v.proceeds) || 0) + (Number(v.transaction2Proceeds) || 0) + (Number(v.transaction3Proceeds) || 0);
        const totalCostBasis = (Number(v.costBasis) || 0) + (Number(v.transaction2CostBasis) || 0) + (Number(v.transaction3CostBasis) || 0);
        const totalGainOrLoss = gain1 + gain2 + gain3;

        this.taxForm.patchValue({
            gainOrLoss: gain1,
            transaction2GainOrLoss: gain2,
            transaction3GainOrLoss: gain3,
            totalProceeds: totalProceeds,
            totalCostBasis: totalCostBasis,
            totalGainOrLoss: totalGainOrLoss
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 8949 Submitted', this.taxForm.getRawValue());
    }
}