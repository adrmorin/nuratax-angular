import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-1099misc', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form1099misc.component.html', styleUrls: ['./form1099misc.component.css'] })
export class Form1099miscComponent implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ payerName: [''], tin: [''], recipientName: [''], recipientTIN: [''], rents: [0], royalties: [0], otherIncome: [0], federalWithheld: [0], fishingBoat: [0], medicalPayments: [0], nonemployeeComp: [0], cropInsurance: [0] });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 1099-MISC Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}