import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-1095c',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form1095c.component.html',
    styleUrls: ['./form1095c.component.css']
})
export class Form1095cComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            employerName: [''], ein: [''], address: [''], city: [''], state: [''], zip: [''],
            contactPhone: [''], contactEmail: [''],
            employeeName: [''], ssn: [''], taxYear: [''],
            partII: this.fb.group({
                offer1: [''], start1: [''], end1: [''], monthly1: [0],
                offer2: [''], start2: [''], end2: [''], monthly2: [0],
                offer3: [''], start3: [''], end3: [''], monthly3: [0]
            }),
            line13: [''], line14: [''], line15: [''], line16: [0], line17: [0],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 1095-C Submitted', this.taxForm.getRawValue()); }
}