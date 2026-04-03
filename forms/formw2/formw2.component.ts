import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-w2',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './formw2.component.html',
    styleUrls: ['./formw2.component.css']
})
export class FormW2Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        purpose: 'El Formulario W-2 reporta salarios y impuestos retenidos del empleado. Los empleadores deben enviarlo al empleado y al SSA.',
        deadline: 'El plazo para entregar a empleados es el 31 de enero. La fecha límite para presentar al SSA es el 31 de enero (electrónico).',
        copies: 'Copy A al SSA, Copy 1 al estado, Copy B al empleado para su declaración, Copy C para registros del empleado.',
        boxes: 'Box 1 = Salario gravable, Box 2 = Retención de income tax, Box 3-6 = Seguridad Social y Medicare, Box 16-17 = Estado.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            ein: [''], employerName: [''], employerAddress: [''],
            employeeName: [''], employeeSSN: [''], employeeAddress: [''],
            box1Wages: [0], box2FederalTax: [0], box3SSWages: [0],
            box4SSTax: [0], box5MedicareWages: [0], box6MedicareTax: [0],
            box10DependentCare: [0], box11Nonqualified: [0], box12Code: [''], box12Amount: [0],
            box13Statutory: 'No', box13Retirement: 'No', box13SickPay: 'No',
            box14Other: [''], box15State: [''], box16StateWages: [0], box17StateTax: [0],
            box15Local: [''], box16LocalWages: [0], box17LocalTax: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form W-2 Submitted', this.taxForm.getRawValue()); }
}