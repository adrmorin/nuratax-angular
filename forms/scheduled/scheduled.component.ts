import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({ selector: 'app-schedule-d', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent], templateUrl: './scheduled.component.html', styleUrls: ['./scheduled.component.css'] })
export class ScheduleDComponent implements OnInit {
    private fb = inject(FormBuilder); private taxDataService = inject(TaxDataService); taxForm: FormGroup;
    constructor() { this.taxForm = this.fb.group({ name: [''], ssn: [''], stSales: [0], stCost: [0], ltSales: [0], ltCost: [0] }); this.taxForm.valueChanges.subscribe(() => this.taxDataService.saveTaxData(this.taxForm.getRawValue())); }
    ngOnInit(): void { const savedData = this.taxDataService.loadTaxData(); if (savedData) this.taxForm.patchValue(savedData, { emitEvent: false }); }
    onSubmit(): void { if (this.taxForm.valid) console.log('Schedule D Submitted', this.taxForm.getRawValue()); else this.taxForm.markAllAsTouched(); }
}