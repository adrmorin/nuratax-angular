import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-ss4',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './formss4.component.html',
    styleUrls: ['./formss4.component.css']
})
export class Formss4Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            legalName: [''], tradeName: [''], entityType: [''],
            stateOfFormation: [''], dateOrganized: [''],
            principalAddress: [''], city: [''], state: [''], zip: [''],
            responsiblePartyName: [''], ssn: [''], responsiblePartyPhone: [''],
            principalActivity: [''], productService: [''],
            numberEmployees: [''], payrollFrequency: [''],
            firstWagesDate: [''], hasAppliedBefore: [''], priorEin: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form SS-4 Submitted', this.taxForm.getRawValue()); }
}