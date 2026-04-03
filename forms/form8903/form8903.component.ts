import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-form-8903',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './form8903.component.html',
    styleUrls: ['./form8903.component.css']
})
export class Form8903Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''], taxYear: [''],
            line1: [0], line2: [0], line3: [0], line4: [0], line5: [0], line6: [0], line7: [0],
            line8: [0], line9: [0], line10: [0], line11: [0], line12: [0],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Form 8903 Submitted', this.taxForm.getRawValue()); }
}