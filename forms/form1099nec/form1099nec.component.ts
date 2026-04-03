import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-form-1099nec', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './form1099nec.component.html', styleUrls: ['./form1099nec.component.css'] })
export class Form1099necComponent implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() {
        this.taxForm = this.fb.group({ payerName: [''], tin: [''], recipientName: [''], recipientTIN: [''], nonemployeeComp: [0], box2: [0], box3: [0], box4: [0], box5: [''] });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Form 1099-NEC Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}