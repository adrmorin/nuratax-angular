import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-1099b', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form1099b.component.html', styleUrls: ['./form1099b.component.css'] })
export class Form1099bComponent implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ payerName: [''], tin: [''], recipientName: [''], recipientTIN: [''], proceeds: [0], costBasis: [0], gainLoss: [{ value: 0, disabled: true }], federalWithheld: [0], description: [''], dateAcquired: [''], dateSold: [''] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ gainLoss: (Number(v.proceeds) || 0) - (Number(v.costBasis) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 1099-B Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}