import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8815',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8815.component.html',
    styleUrls: ['./form8815.component.css']
})
export class Form8815Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;

    constructor() {
        this.taxForm = this.fb.group({
            name: [''], ssn: [''],
            totalCompensation: [0], amountDeferred: [0], includible: [{ value: 0, disabled: true }],
            earnings: [0], previouslyIncluded: [0], totalEarnings: [{ value: 0, disabled: true }]
        });
        this.taxForm.valueChanges.subscribe(() => {
            const v = this.taxForm.getRawValue();
            this.taxForm.patchValue({
                includible: (Number(v.totalCompensation) || 0) - (Number(v.amountDeferred) || 0),
                totalEarnings: (Number(v.earnings) || 0) - (Number(v.previouslyIncluded) || 0)
            }, { emitEvent: false });
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) console.log('Form 8815 Submitted', this.taxForm.getRawValue());
        else this.taxForm.markAllAsTouched();
    }
}