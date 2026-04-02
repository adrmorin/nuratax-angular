import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-form1099ltc',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form1099ltc.component.html',
    styleUrl: './form1099ltc.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Form1099ltcComponent implements OnInit {
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    form1099ltc!: FormGroup;

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.form1099ltc = this.fb.group({
            payerName: [''],
            payerStreetAddress: [''],
            payerCity: [''],
            payerState: [''],
            payerZipCode: [''],
            payerTelephoneNo: [''],
            payerTin: [''],
            recipientTin: [''],
            recipientAccountNumber: [''],
            policyholderName: [''],
            policyholderStreetAddress: [''],
            policyholderCity: [''],
            policyholderState: [''],
            policyholderZipCode: [''],
            insuredName: [''],
            insuredStreetAddress: [''],
            insuredCity: [''],
            insuredState: [''],
            insuredZipCode: [''],
            insuredIsDifferent: [false],
            box1: [0],
            box2: [0],
            box3PerDiem: [false],
            box3Reimbursed: [false],
            box4QualifiedContract: [false],
            box5ChronicallyIll: [false],
            box5TerminallyIll: [false],
            box5LatestCertificationDate: ['']
        });

        const formValues$ = toSignal(this.form1099ltc.valueChanges);

        effect(() => {
            const raw = formValues$();
            if (raw) {
                untracked(() => {
                    this.calculateForm(raw);
                    this.cdr.markForCheck();
                });
            }
        });
    }

    private calculateForm(raw: Record<string, string | number | boolean | null | undefined>): void {
    }

    onSubmit(): void {
        console.log(this.form1099ltc.getRawValue());
    }
}
