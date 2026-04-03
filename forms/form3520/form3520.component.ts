import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-3520',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form3520.component.html',
    styleUrls: ['./form3520.component.css']
})
export class Form3520Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        part1: 'Las transacciones con fideicomisos extranjeros deben reportarse si el valor supera $10,000. La omisión activa penalidades severas.',
        part2: 'Los regalos extranjeros superiores a $100,000 deben reportarse. Donees de países específicos pueden tener requisitos adicionales.',
        part3: 'Reporte la propiedad beneficiar efectiva del fideicomiso. Cambios en la propiedad deben reportarse dentro de los 30 días.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            name: [''],
            ssn: [''],
            ein: [''],
            taxYear: [2026],

            part1TrustName: [''],
            trustName1: [''],
            trustCountry: [''],
            transferAmount: [0],
            distributionAmount: [0],
            loanAmount: [0],

            donorName: [''],
            donorCountry: [''],
            giftAmount: [0],
            giftDescription: [''],

            beneficiaryName: [''],
            beneficiarySSN: [''],
            trustInterest: [0]
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
        if (this.taxForm.valid) {
            console.log('Form 3520 Submitted', this.taxForm.getRawValue());
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
