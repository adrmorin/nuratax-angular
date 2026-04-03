import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-7004',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form7004.component.html',
    styleUrls: ['./form7004.component.css']
})
export class Form7004Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        part1: 'Seleccione el tipo de formulario correcto para la extensión. Una extensión separada por cada tipo de return.',
        part2: 'El Form 7004 otorga 6 meses adicionales. Para corporaciones C el plazo es el día 15 del sexto mes después del año fiscal.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            name: [''],
            tin: [''],
            address: [''],
            cityStateZip: [''],

            form1065: [false],
            form1120: [false],
            form1120S: [false],
            form1041: [false],
            form940: [false],
            form941: [false],
            otherForm: [''],

            taxYear: [''],
            balanceDue: [0],
            paymentsMade: [0],
            balanceOwed: [{ value: 0, disabled: true }],

            signature: [''],
            dateSigned: [''],
            phone: [''],
            title: ['']
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
        const balanceOwed = (Number(v.balanceDue) || 0) - (Number(v.paymentsMade) || 0);

        this.taxForm.patchValue({
            balanceOwed: balanceOwed
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 7004 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
