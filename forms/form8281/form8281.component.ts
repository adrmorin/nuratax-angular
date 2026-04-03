import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8281',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8281.component.html',
    styleUrls: ['./form8281.component.css']
})
export class Form8281Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    nereaAdvice = {
        part1: 'Las acciones QSB bajo Sección 1202 pueden tener exclusión de ganancia. Verifique elegibilidad antes de reportar.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            issuerName: [''],
            tin: [''],
            address: [''],
            cityStateZip: [''],
            description: [''],
            issueDate: [''],
            issuePrice: [0],
            statedRedemption: [0],
            totalOID: [{ value: 0, disabled: true }],
            termYears: [0],
            yieldToMaturity: [0],
            qsb: [false],
            acquisitionDate: [''],
            acquisitionPrice: [0]
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
        const totalOID = (Number(v.statedRedemption) || 0) - (Number(v.issuePrice) || 0);
        this.taxForm.patchValue({ totalOID: totalOID }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form 8281 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}