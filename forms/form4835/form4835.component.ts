import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-4835',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form4835.component.html',
    styleUrls: ['./form4835.component.css']
})
export class Form4835Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], taxYear: [''],
            partAGI: [0], partDeductions: [0], partNetIncome: [0],
            line1: [0], line2: [0], line3: [0], line4: [0], line5: [0], line6: [0], line7: [0], line8: [0],
            line9: [0], line10: [0], line11: [0], line12: [0], line13: [0], line14: [0], line15: [0],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 4835 Submitted', this.taxForm.getRawValue()); }
}