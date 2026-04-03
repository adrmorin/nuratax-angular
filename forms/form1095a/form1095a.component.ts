import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1095a',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1095a.component.html',
    styleUrls: ['./form1095a.component.css']
})
export class Form1095aComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            marketPlaceName: [''], marketPlaceEin: [''], policyNumber: [''], taxYear: [''],
            accountHolder: [''], holderTin: [''], address: [''], city: [''], state: [''], zip: [''],
            m1Name: [''], m1DOB: [''], m1Tin: [''], m1Enroll: [''], m1Annual: [0], m1Jan: [0], m1Feb: [0], m1Mar: [0], m1Apr: [0], m1May: [0], m1Jun: [0], m1Jul: [0], m1Aug: [0], m1Sep: [0], m1Oct: [0], m1Nov: [0], m1Dec: [0],
            m2Name: [''], m2DOB: [''], m2Tin: [''], m2Enroll: [''],
            m3Name: [''], m3DOB: [''], m3Tin: [''], m3Enroll: [''],
            line14: [0], line15: [0], line16: [0], line17: [0], line18: [0], line19: [0], line20: [0],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1095-A Submitted', this.taxForm.getRawValue()); }
}