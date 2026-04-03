import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1045',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1045.component.html',
    styleUrls: ['./form1045.component.css']
})
export class Form1045Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            applicantName: [''], ssn: [''], ein: [''], address: [''], city: [''], state: [''], zip: [''],
            taxYear: [''], filedWith: [''], applicationType: [''],
            netOperatingLoss: [0], carrybackYear: [''], carryforwardYears: [''],
            attachmentCopy: [''], signature: [''], dateSigned: [''], phone: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1045 Submitted', this.taxForm.getRawValue()); }
}