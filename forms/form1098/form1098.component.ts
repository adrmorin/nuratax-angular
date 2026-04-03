import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-1098',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1098.component.html',
    styleUrls: ['./form1098.component.css']
})
export class Form1098Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            lenderName: [''], lenderTin: [''], borrowerName: [''], borrowerTin: [''],
            propertyAddress: [''], interestPaid: [0], pointsPaid: [0], originationFees: [0],
            insurancePremiums: [0], mortgageInsurance: [0], propertyTax: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1098 Submitted', this.taxForm.getRawValue()); }
}