import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';

@Component({
    selector: 'app-schedule-k1',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './schedulek1.component.html',
    styleUrls: ['./schedulek1.component.css']
})
export class Schedulek1Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            entityName: [''], entityEin: [''], partnerName: [''], partnerTin: [''], taxYear: [''],
            l1: [''], l2: [0], l3: [0], l4: [0], l5: [0], l6: [0], l7: [0], l8: [0], l9: [0],
            l10: [0], l11: [0], l12: [0], l13: [0], l14: [0], l15: [0], l16: [0], l17: [0],
            signature: [''], dateSigned: ['']
        });
        this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue()));
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void { console.log('Schedule K-1 Submitted', this.taxForm.getRawValue()); }
}