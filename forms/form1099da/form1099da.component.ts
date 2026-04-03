import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1099da',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1099da.component.html',
    styleUrls: ['./form1099da.component.css']
})
export class Form1099DAComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'El Formulario 1099-DA reporta ganancias o pérdidas de transacciones de activos digitales (criptomonedas, NFTs, tokens). Los corredores deben reportar esta información al IRS.',
        reporting: 'A partir de 2026, los corredores deben reportar transacciones de activos digitales. Esto incluye intercambios, ventas, y conversiones de criptomonedas.',
        costBasis: 'El corredor debe reportar la base de costo si la tenía disponible. Si no, debes calcularla tú mismo para reportar correctamente las ganancias o pérdidas.',
        grossProceeds: 'Para 2026, los corredores solo están obligados a reportar ingresos brutos. Esto puede resultar en doble tributación si no rastreas correctamente tus costos.',
        tracking: 'Mantén registros detallados de todas las transacciones de activos digitales, incluyendo fecha de adquisición, precio de compra, y fecha de venta.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Payer Information
            payerName: [''],
            payerTIN: [''],
            payerState: [''],

            // Recipient Information
            recipientName: [''],
            recipientTIN: [''],
            recipientState: [''],

            // Transaction Details
            accountNumber: [''],
            transactionType: [''],
            digitalAssetSymbol: [''],

            // Financial Information
            grossProceeds: [0],
            costBasis: [0],
            gainOrLoss: [{ value: 0, disabled: true }],

            // Additional
            transactionDate: [''],
            dispositionMethod: ['']
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
        const gainOrLoss = (Number(v.grossProceeds) || 0) - (Number(v.costBasis) || 0);
        this.taxForm.patchValue({ gainOrLoss: gainOrLoss }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 1099-DA Submitted', this.taxForm.getRawValue());
    }
}