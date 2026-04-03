import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxDataService } from '../../../services/tax-data.service';
import { ChatFormsComponent } from '../chatforms/chatforms.component';

@Component({
    selector: 'app-form-w8ben',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './formw8ben.component.html',
    styleUrls: ['./formw8ben.component.css']
})
export class FormW8benComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            // Part I: Identification of Beneficial Owner
            name: ['', Validators.required],
            citizenship: ['', Validators.required],
            residenceAddress: ['', Validators.required],
            residenceCityState: ['', Validators.required],
            residenceCountry: ['', Validators.required],
            mailingAddress: [''],
            mailingCityState: [''],
            mailingCountry: [''],
            tin: [''],
            foreignTIN: [''],
            checkIfNoFTIN: [false],
            referenceNumbers: [''],
            dob: ['', Validators.required],

            // Part II: Claim of Tax Treaty Benefits
            treatyCountry: [''],
            specialRatesArticle: [''],
            specialRatesRate: [0],
            specialRatesIncomeType: [''],
            specialRatesExplanation: [''],

            // Part III: Certification
            certified: [false, Validators.requiredTrue],
            signerName: ['', Validators.required],
            dateSigned: [new Date().toISOString().split('T')[0]],
            capacity: ['self']
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
        }

        this.taxForm.valueChanges.subscribe(val => {
            this.taxDataService.saveTaxData(val);
        });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form W-8BEN Submitted', this.taxForm.value);
        } else {
            this.taxForm.markAllAsTouched();
        }
    }
}
