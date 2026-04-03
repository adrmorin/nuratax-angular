import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-3800', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form3800.component.html', styleUrls: ['./form3800.component.css'] })
export class Form3800Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ein: [''], carryforward: [0], currentYearCredit: [0], totalAvailable: [{ value: 0, disabled: true }], creditUsed: [0], carryback: [0], remaining: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); this.taxForm.patchValue({ totalAvailable: (Number(v.carryforward) || 0) + (Number(v.currentYearCredit) || 0), remaining: ((Number(v.carryforward) || 0) + (Number(v.currentYearCredit) || 0)) - (Number(v.creditUsed) || 0) - (Number(v.carryback) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 3800 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}