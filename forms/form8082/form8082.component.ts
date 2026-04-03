import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8082',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8082.component.html',
    styleUrls: ['./form8082.component.css']
})
export class Form8082Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 8082 notifica al IRS sobre tratamientos inconsistentes entre lo que reportó la entidad (asociación, corporación S, fideicomiso) y lo que reporta el contribuyente en su declaración.',
        whenToUse: 'Usa este formulario cuando tu tratamiento de un elemento difiere del reportado por la entidad en su Schedule K-1, K-3, o otro documento similar.',
        penalty: 'El IRS puede imponer multas si no reportas inconsistencias. La notificación permite corregir el tratamiento antes de una auditoría.',
        aar: 'También se usa para Solicitudes de Ajuste Administrativo (AAR) cuando una entidad quiere corregir un error en su declaración.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Part I - Shareholder/Partner/Beneficiary Information
            name: [''],
            tin: [''],
            entityName: [''],
            entityTin: [''],

            // Part II - Inconsistent Treatment
            description1: [''],
            amount1: [0],
            entityTreatment1: [''],
            taxpayerTreatment1: [''],

            description2: [''],
            amount2: [0],
            entityTreatment2: [''],
            taxpayerTreatment2: [''],

            description3: [''],
            amount3: [0],
            entityTreatment3: [''],
            taxpayerTreatment3: [''],

            description4: [''],
            amount4: [0],
            entityTreatment4: [''],
            taxpayerTreatment4: [''],

            // Part III - Administrative Adjustment Request (AAR)
            aarRequest: ['No'],
            aarDescription: [''],
            requestedChange: [0],

            // Explanation
            explanation: ['']
        });

        this.taxForm.valueChanges.subscribe(() => {
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
        }
    }

    onSubmit(): void {
        console.log('Form 8082 Submitted', this.taxForm.getRawValue());
    }
}