import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-4506',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form4506.component.html',
    styleUrls: ['./form4506.component.css']
})
export class Form4506Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            requesterName: [''], ssn: [''], ein: [''], address: [''], city: [''], state: [''], zip: [''],
            taxYear1: [''], taxYear2: [''], taxYear3: [''], taxYear4: [''], taxYear5: [''],
            formType: [''], specificYear: [''], userFee: [''],
            signature: [''], dateSigned: [''], phone: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 4506 Submitted', this.taxForm.getRawValue()); }
}