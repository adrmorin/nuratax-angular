import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1120s',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1120s.component.html',
    styleUrls: ['./form1120s.component.css']
})
export class Form1120SComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 1120-S es la declaración de impuestos para corporaciones S. Las corporaciones S no pagan impuestos a nivel corporativo; los ingresos pasan a los accionistas.',
        k1: 'Cada accionista recibe un Schedule K-1 reportando su porción del ingreso, deducciones, y créditos.',
        deadline: 'El plazo es el 15 de marzo para corporaciones de año calendario. Las corporaciones S deben presentar electrónicamente.',
        audit: 'Las corporaciones S tienen mayor probabilidad de auditoría. Mantén registros detallados de transacciones entre la corporación y accionistas.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            corpName: [''], ein: [''], state: [''],
            grossReceipts: [0], costOfGoods: [0], grossProfit: [0],
            totalIncome: [0], deductions: [0], ordinaryIncome: [0],
            totalTax: [0], totalPayments: [0], balanceDue: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const grossProfit = (Number(v.grossReceipts) || 0) - (Number(v.costOfGoods) || 0);
        const ordinaryIncome = (Number(v.totalIncome) || 0) - (Number(v.deductions) || 0);
        const balance = (Number(v.totalTax) || 0) - (Number(v.totalPayments) || 0);
        this.taxForm.patchValue({ grossProfit: grossProfit, ordinaryIncome: ordinaryIncome, balanceDue: balance > 0 ? balance : 0 }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1120-S Submitted', this.taxForm.getRawValue()); }
}