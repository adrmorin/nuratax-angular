import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1040es',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1040es.component.html',
    styleUrls: ['./form1040es.component.css']
})
export class Form1040ESComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;
    selfEmployedRate = 0.9235;

    nereaAdvice = {
        purpose: 'Form 1040-ES calcula los pagos estimados de impuestos para trabajadores independientes y quienes tienen ingresos sin retención.',
        dueDates: 'Los pagos trimestrales vencen: 15 de abril, 15 de junio, 15 de septiembre, y 15 de enero del año siguiente.',
        safeHarbor: 'Para evitar multas, paga el 100% de la obligación del año anterior (110% si AGI > $150,000) o el 90% de la obligación actual.',
        calculation: 'Resta el 92.35% de los ingresos netos de trabajo por cuenta propia para obtener el ingreso sujeto a impuesto de SE.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''],
            income: [0], businessExpenses: [0], netSelfEmployment: [0],
            selfEmploymentTax: [0], incomeTax: [0], totalTax: [0],
            priorYearTax: [0], requiredPayment: [0],
            payment1: [0], payment2: [0], payment3: [0], payment4: [0]
        });
        this.taxForm.valueChanges.subscribe(() => { this.calculateValues(); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        const netSE = (Number(v.income) || 0) - (Number(v.businessExpenses) || 0);
        const seTax = netSE * 0.9235 * 0.153;
        this.taxForm.patchValue({ netSelfEmployment: netSE, selfEmploymentTax: seTax }, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1040-ES Submitted', this.taxForm.getRawValue()); }
}