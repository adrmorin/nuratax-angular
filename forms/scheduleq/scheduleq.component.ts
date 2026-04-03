import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-schedule-q',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './scheduleq.component.html',
    styleUrls: ['./scheduleq.component.css']
})
export class ScheduleQComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Schedule Q es un aviso trimestral a los tenedores de interés residual de REMIC sobre la asignación de ingreso gravable o pérdida neta del REMIC.',
        whoUses: 'Los tenedores de intereses residuales en un REMIC reciben este formulario trimestralmente del fideicomiso REMIC.',
        timing: 'Se emite trimestralmente (marzo, junio, septiembre, diciembre). Los plazos dependen del cierre del trimestre del REMIC.',
        income: 'El ingreso o pérdida del REMIC se asigna a los tenedores de interés residual proporcionalmente a su participación.',
        reporting: 'Reporta tu porción del ingreso o pérdida del REMIC en tu declaración de impuestos. Puede ser ingreso ordinario o pérdida deductible.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // REMIC Information
            remicName: [''],
            remicEin: [''],
            quarterEnding: [''],

            // Holder Information
            holderName: [''],
            holderTin: [''],

            // Income/Loss Allocation
            remicTaxableIncome: [0],
            excessInclusion: [0],
            section212Deduction: [0],
            netLoss: [0],
            taxableIncome: [0],

            // Allocation Details
            holderInterestPercentage: [0],
            holderIncome: [0],
            holderDeduction: [0],
            holderExcessInclusion: [0],
            holderNetAllocation: [0],

            // Additional Items
            qualifiedResiduals: ['No'],
            transferableInterest: ['No']
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
        
        const percentage = (Number(v.holderInterestPercentage) || 0) / 100;
        const holderIncome = (Number(v.remicTaxableIncome) || 0) * percentage;
        const holderDeduction = (Number(v.section212Deduction) || 0) * percentage;
        const holderExcess = (Number(v.excessInclusion) || 0) * percentage;
        const netAllocation = holderIncome - holderDeduction + holderExcess;

        this.taxForm.patchValue({
            holderIncome: holderIncome,
            holderDeduction: holderDeduction,
            holderExcessInclusion: holderExcess,
            holderNetAllocation: netAllocation
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Schedule Q Submitted', this.taxForm.getRawValue());
    }
}