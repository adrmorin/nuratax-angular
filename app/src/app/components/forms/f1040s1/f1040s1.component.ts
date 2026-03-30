import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatFormsComponent } from '../chatforms/chatforms.component';

@Component({
    selector: 'app-f1040s1',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './f1040s1.component.html',
    styleUrl: './f1040s1.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class F1040s1Component implements OnInit {
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    scheduleForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.scheduleForm = this.fb.group({
            // Header
            nameShown: [''],
            ssn: [''],

            // Part I Additional Income
            line1: [0],
            line2a: [0],
            line2b: [''], // Date
            line3: [0],
            line4: [0],
            line5: [0],
            line6: [0],
            line7: [0],

            // Other Income
            line8a: [0],
            line8b: [0],
            line8c: [0],
            line8d: [0],
            line8e: [0],
            line8f: [0],
            line8g: [0],
            line8h: [0],
            line8i: [0],
            line8j: [0],
            line8k: [0],
            line8l: [0],
            line8m: [0],
            line8n: [0],
            line8o: [0],
            line8p: [0],
            line8q: [0],
            line8r: [0],
            line8s: [0],
            line8t: [0],
            line8u: [0],
            line8v: [0],
            line8z: [0],
            line9: [{ value: 0, disabled: true }],
            line10: [{ value: 0, disabled: true }],

            // Part II Adjustments to Income
            line11: [0],
            line12: [0],
            line13: [0],
            line14: [0],
            line15: [0],
            line16: [0],
            line17: [0],
            line18: [0],
            line19a: [0],
            line19b: [''], // SSN
            line19c: [''], // Date
            line20: [0],
            line21: [0],
            line22: [{ value: 0, disabled: true }], // Reserved
            line23: [0],

            // Other Adjustments
            line24a: [0],
            line24b: [0],
            line24c: [0],
            line24d: [0],
            line24e: [0],
            line24f: [0],
            line24g: [0],
            line24h: [0],
            line24i: [0],
            line24j: [0],
            line24k: [0],
            line24z: [0],
            line25: [{ value: 0, disabled: true }],
            line26: [{ value: 0, disabled: true }]
        });

        const formValues$ = toSignal(this.scheduleForm.valueChanges);

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

    private calculateForm(raw: Record<string, string | number | null | undefined>): void {
        const getVal = (key: string): number => Number(raw[key]) || 0;

        // Part I
        const l8_sum = getVal('line8a') + getVal('line8b') + getVal('line8c') + getVal('line8d') +
            getVal('line8e') + getVal('line8f') + getVal('line8g') + getVal('line8h') +
            getVal('line8i') + getVal('line8j') + getVal('line8k') + getVal('line8l') +
            getVal('line8m') + getVal('line8n') + getVal('line8o') + getVal('line8p') +
            getVal('line8q') + getVal('line8r') + getVal('line8s') + getVal('line8t') +
            getVal('line8u') + getVal('line8v') + getVal('line8z');
        const l9 = l8_sum;
        const l10 = getVal('line1') + getVal('line2a') + getVal('line3') + getVal('line4') +
            getVal('line5') + getVal('line6') + getVal('line7') + l9;

        // Part II
        const l24_sum = getVal('line24a') + getVal('line24b') + getVal('line24c') + getVal('line24d') +
            getVal('line24e') + getVal('line24f') + getVal('line24g') + getVal('line24h') +
            getVal('line24i') + getVal('line24j') + getVal('line24k') + getVal('line24z');
        const l25 = l24_sum;
        const l26 = getVal('line11') + getVal('line12') + getVal('line13') + getVal('line14') +
            getVal('line15') + getVal('line16') + getVal('line17') + getVal('line18') +
            getVal('line19a') + getVal('line20') + getVal('line21') + getVal('line23') + l25;

        this.scheduleForm.patchValue({
            line9: l9,
            line10: l10,
            line22: 0,
            line25: l25,
            line26: l26
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log(this.scheduleForm.getRawValue());
    }
}
