import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-8829', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form8829.component.html', styleUrls: ['./form8829.component.css'] })
export class Form8829Component implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ name: [''], ssn: [''], areaHome: [0], areaTotal: [0], businessPct: [{ value: 0, disabled: true }], mortgageInterest: [0], realEstateTaxes: [0], repairs: [0], utilities: [0], otherExpenses: [0], totalExpenses: [{ value: 0, disabled: true }] });
        this.taxForm.valueChanges.subscribe(() => { const v = this.taxForm.getRawValue(); const pct = (Number(v.areaHome) || 0) / (Number(v.areaTotal) || 1); this.taxForm.patchValue({ businessPct: pct, totalExpenses: (Number(v.mortgageInterest) || 0) + (Number(v.realEstateTaxes) || 0) + (Number(v.repairs) || 0) + (Number(v.utilities) || 0) + (Number(v.otherExpenses) || 0) }, { emitEvent: false }); this.taxDataService.saveTaxData(this.taxForm.getRawValue()); });
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 8829 Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}