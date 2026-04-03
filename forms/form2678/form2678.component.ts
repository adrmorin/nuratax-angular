import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-2678',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form2678.component.html',
    styleUrls: ['./form2678.component.css']
})
export class Form2678Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            agentName: [''], agentTin: [''], agentPhone: [''], agentEmail: [''],
            agentAddress: [''], agentCity: [''], agentState: [''], agentZip: [''],
            employerName: [''], employerTin: [''], employerAddress: [''], employerCity: [''],
            employerState: [''], employerZip: [''], taxTypes: [''], effectiveDate: [''],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 2678 Submitted', this.taxForm.getRawValue()); }
}