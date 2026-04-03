import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-2553',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form2553.component.html',
    styleUrls: ['./form2553.component.css']
})
export class Form2553Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'Form 2553 electe el estado de Corporación S para efectos fiscales. Permite que la corporación evite la tributación a nivel corporativo y los ingresos pasen a los accionistas.',
        deadline: 'El plazo es el 15 de marzo para corporaciones de año calendario. Se puede pedir alivio por elección tardía dentro de los 3 años y 12 semanas.',
        requirements: 'Para calificar: máximo 100 accionistas, un solo tipo de acciones, todos los accionistas deben ser individuos o fideicomisos estadounidenses, no puede ser institución financiera.',
        election: 'Todos los accionistas deben firmar el formulario. La elección es irrevocable a menos que la corporación cumpla requisitos para terminar.',
        formW4: 'Los empleados-dueños deben recibir un Formulario W-2 con salarios sujetos a retener impuestos de Seguridad Social y Medicare.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Corporation Information
            corpName: [''],
            ein: [''],
            stateOfIncorporation: [''],
            dateIncorporated: [''],

            // Election Information
            taxYearBeginning: [''],
            electionDate: [''],
            effectiveDate: [''],

            // Shareholder Information
            shareholder1Name: [''],
            shareholder1SSN: [''],
            shareholder1Shares: [0],
            shareholder1Signed: ['No'],

            shareholder2Name: [''],
            shareholder2SSN: [''],
            shareholder2Shares: [0],
            shareholder2Signed: ['No'],

            shareholder3Name: [''],
            shareholder3SSN: [''],
            shareholder3Shares: [0],
            shareholder3Signed: ['No'],

            // Share Requirements
            max100Shareholders: ['Yes'],
            singleClassStock: ['Yes'],
            allShareholdersUSPersons: ['Yes'],
            notExcludedEntity: ['Yes'],

            // Authorized Person
            authorizedPerson: [''],
            title: [''],
            signatureDate: ['']
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
        console.log('Form 2553 Submitted', this.taxForm.getRawValue());
    }
}