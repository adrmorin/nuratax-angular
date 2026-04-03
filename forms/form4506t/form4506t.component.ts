import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-4506t',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form4506t.component.html',
    styleUrls: ['./form4506t.component.css']
})
export class Form4506tComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            requesterName: [''], ssn: [''], ein: [''], address: [''], city: [''], state: [''], zip: [''],
            taxYear1: [''], taxYear2: [''], taxYear3: [''], taxYear4: [''], taxYear5: [''],
            transcriptType: [''], mailToThirdParty: [''], thirdPartyName: [''], thirdPartyAddress: [''],
            signature: [''], dateSigned: [''], phone: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 4506-T Submitted', this.taxForm.getRawValue()); }
}