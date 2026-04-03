import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1099div',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1099div.component.html',
    styleUrls: ['./form1099div.component.css']
})
export class Form1099DIVComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            payerName: [''], payerTin: [''], recipiName: [''], recipiTin: [''],
            totalDividends: [0], qualifiedDividends: [0], ordinaryDividends: [0],
            capitalGainDist: [0], section199A: [0], nonTaxable: [0], exemptDividends: [0],
            foreignTax: [0], qualifiedForeignTax: [0]
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1099-DIV Submitted', this.taxForm.getRawValue()); }
}