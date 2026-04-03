import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-8995a',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form8995a.component.html',
    styleUrls: ['./form8995a.component.css']
})
export class Form8995aComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            entityName: [''], ein: [''], taxYear: [''],
            partnerName: [''], partnerTin: [''],
            line1: [0], line2: [0], line3: [0], line4: [0], line5: [0], line6: [0], line7: [0],
            line8: [0], line9: [0], line10: [0], line11: [0], line12: [0], line13: [0],
            ownershipPercent: [0], allocatedQBI: [0], allocatedW2: [0], allocatedUBIA: [0],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 8995-A Submitted', this.taxForm.getRawValue()); }
}