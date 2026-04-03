import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1041',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1041.component.html',
    styleUrls: ['./form1041.component.css']
})
export class Form1041Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 1041 es la declaración de ingresos para fideicomisos y sucesiones. Los fideicomisos no pagan impuestos sobre el ingreso distribuye.',
        k1: 'Cada beneficiario recibe un Schedule K-1 reportando su porción del ingreso, deducciones, y créditos.',
        deadline: 'El plazo es el 15 de abril para fideicomisos de año calendario. Las sucesiones tienen 15 de abril o 9 meses después del decedent.',
        fiduciary: 'El fiduciario es responsable de presentar la declaración y asegurar que los beneficiarios reporten su porción correctamente.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            estateName: [''], ein: [''], fidName: [''], fidAddress: [''],
            grossIncome: [0], deductions: [0], incomeDistribution: [0], taxableIncome: [0],
            totalTax: [0], totalPayments: [0], balanceDue: [0], refund: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const taxable = Math.max(0, (Number(v.grossIncome) || 0) - (Number(v.deductions) || 0) - (Number(v.incomeDistribution) || 0));
        const balance = (Number(v.totalTax) || 0) - (Number(v.totalPayments) || 0);
        this.taxForm.patchValue({ taxableIncome: taxable, balanceDue: balance > 0 ? balance : 0, refund: balance < 0 ? Math.abs(balance) : 0 }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1041 Submitted', this.taxForm.getRawValue()); }
}