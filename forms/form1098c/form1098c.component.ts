import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1098c',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1098c.component.html',
    styleUrls: ['./form1098c.component.css']
})
export class Form1098CComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            charityName: [''], charityTin: [''], donorName: [''], donorAddress: [''],
            vehicleDescription: [''], vehicleVIN: [''], salePrice: [0], value: [0],
            goodFaithEstimate: [0], intUse: 'No', goodsServices: 'No', certNoGoods: 'No'
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1098-C Submitted', this.taxForm.getRawValue()); }
}