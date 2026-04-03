import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-940',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form940.component.html',
    styleUrls: ['./form940.component.css']
})
export class Form940Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    futaRate = 0.006;

    nereaAdvice = {
        purpose: 'Form 940 reporta el impuesto anual federal de desempleo (FUTA). Los empleadores pagan este impuesto para financiar beneficios de desempleo.',
        rate: 'La tasa federal de FUTA es 6.0%. Puedes recibir crédito de hasta 5.4% por impuestos estatales de desempleo pagados, resultando en 0.6% efectivo.',
        threshold: 'Si pagaste $1,500 o más en salarios durante cualquier trimestre calendario, estás sujeto a FUTA.',
        schedule: 'El plazo es el 31 de enero. Los depósitos pueden ser requeridos si tu responsabilidad anual excede $500.',
        credit: 'Si pagaste oportunamente tus impuestos estatales de desempleo, puedes reclamar el crédito del 5.4% en la línea 11.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            employerName: [''],
            ein: [''],
            stateWherePaying: [''],
            totalWages: [0],
            exemptWages: [0],
            taxableWages: [0],
            futaTaxBeforeCredits: [0],
            stateTaxesPaid: [0],
            creditReduction: [0],
            totalCredit: [0],
            futaTaxLiability: [0],
            depositsMade: [0],
            balanceDue: [0],
            overpayment: [0]
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
        const taxableWages = (Number(v.totalWages) || 0) - (Number(v.exemptWages) || 0);
        const futaTaxBefore = taxableWages * this.futaRate;
        const totalCredit = (Number(v.stateTaxesPaid) || 0) + (Number(v.creditReduction) || 0);
        const futaLiability = Math.max(0, futaTaxBefore - totalCredit);
        const balanceDue = futaLiability - (Number(v.depositsMade) || 0);

        this.taxForm.patchValue({
            taxableWages: taxableWages,
            futaTaxBeforeCredits: futaTaxBefore,
            totalCredit: totalCredit,
            futaTaxLiability: futaLiability,
            balanceDue: balanceDue > 0 ? balanceDue : 0,
            overpayment: balanceDue < 0 ? Math.abs(balanceDue) : 0
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 940 Submitted', this.taxForm.getRawValue());
    }
}