import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-7205', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form7205.component.html', styleUrls: ['./form7205.component.css'] })
export class Form7205Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ssn: [''], newConstruction: [0], qualifiedRehab: [0], energyEfficient: [0], totalCredit: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ totalCredit: (Number(v.newConstruction) || 0) + (Number(v.qualifiedRehab) || 0) + (Number(v.energyEfficient) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 7205 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}