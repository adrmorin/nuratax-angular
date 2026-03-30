import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatFormsComponent } from '../chatforms/chatforms.component';

@Component({
    selector: 'app-fs10401-a',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './fs10401-a.component.html',
    styleUrl: './fs10401-a.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Fs10401AComponent implements OnInit {
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

            // Part I
            line1: [0],
            line2a: [0],
            line2b: [0],
            line2c: [0],
            line2d: [0],
            line2e: [{ value: 0, disabled: true }],
            line3: [{ value: 0, disabled: true }],

            // Part II
            line4: [''],
            line4a: [0],
            line4b: [0],
            line4c: [{ value: 0, disabled: true }],
            line5: [0],
            line6: [{ value: 0, disabled: true }],
            line7: [{ value: 0, disabled: true }],
            line8: [{ value: 0, disabled: true }],
            line9: [150000],
            line10: [{ value: 0, disabled: true }],
            line11: [{ value: 0, disabled: true }],
            line12: [{ value: 0, disabled: true }],
            line13: [{ value: 0, disabled: true }],

            // Part III
            line14a: [0],
            line14b: [0],
            line14c: [{ value: 0, disabled: true }],
            line15: [{ value: 0, disabled: true }],
            line16: [{ value: 0, disabled: true }],
            line17: [150000],
            line18: [{ value: 0, disabled: true }],
            line19: [{ value: 0, disabled: true }],
            line20: [{ value: 0, disabled: true }],
            line21: [{ value: 0, disabled: true }],

            // Part IV
            vinA: [''],
            vinB: [''],
            line22a_ii: [0],
            line22a_iii: [0],
            line22b_ii: [0],
            line22b_iii: [0],
            line23: [{ value: 0, disabled: true }],
            line24: [{ value: 0, disabled: true }],
            line25: [{ value: 0, disabled: true }],
            line26: [100000],
            line27: [{ value: 0, disabled: true }],
            line28: [{ value: 0, disabled: true }],
            line29: [{ value: 0, disabled: true }],
            line30: [{ value: 0, disabled: true }],

            // Part V
            line31: [{ value: 0, disabled: true }],
            line32: [75000],
            line33: [{ value: 0, disabled: true }],
            line34: [{ value: 0, disabled: true }],
            line35: [{ value: 0, disabled: true }],
            line36a: [0],
            line36b: [0],
            line37: [{ value: 0, disabled: true }],

            // Part VI
            line38: [{ value: 0, disabled: true }]
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
        const l2e = getVal('line2a') + getVal('line2b') + getVal('line2c') + getVal('line2d');
        const l3 = getVal('line1') + l2e;

        // Part II
        const l4c = 0; // Complexity: "If you only received qualified tips..."
        const l6 = l4c + getVal('line5');
        const l7 = Math.min(l6, 25000);
        const l8 = l3;
        const l9 = getVal('line9') || 150000;
        const l10 = l8 - l9;
        let l13 = 0;
        let l11 = 0;
        let l12 = 0;
        if (l10 <= 0) {
            l13 = l7;
        } else {
            l11 = Math.floor(l10 / 1000);
            l12 = l11 * 100;
            l13 = Math.max(0, l7 - l12);
        }

        // Part III
        const l14c = getVal('line14a') + getVal('line14b');
        const l15_limit = getVal('line17') === 300000 ? 25000 : 12500;
        const l15 = Math.min(l14c, l15_limit);
        const l16 = l3;
        const l17 = getVal('line17') || 150000;
        const l18 = l16 - l17;
        let l21 = 0;
        let l19 = 0;
        let l20 = 0;
        if (l18 <= 0) {
            l21 = l15;
        } else {
            l19 = Math.floor(l18 / 1000);
            l20 = l19 * 100;
            l21 = Math.max(0, l15 - l20);
        }

        // Part IV
        const l23 = getVal('line22a_iii') + getVal('line22b_iii');
        const l24 = Math.min(l23, 10000);
        const l25 = l3;
        const l26 = getVal('line26') || 100000;
        const l27 = l25 - l26;
        let l30 = 0;
        let l28 = 0;
        let l29 = 0;
        if (l27 <= 0) {
            l30 = l24;
        } else {
            l28 = Math.ceil(l27 / 1000);
            l29 = l28 * 200;
            l30 = Math.max(0, l24 - l29);
        }

        // Part V
        const l31 = l3;
        const l32 = getVal('line32') || 75000;
        const l33 = l31 - l32;
        let l35 = 0;
        let l34 = 0;
        if (l33 <= 0) {
            l35 = 6000;
        } else {
            l34 = l33 * 0.06;
            l35 = Math.max(0, 6000 - l34);
        }
        const l37 = getVal('line36a') + getVal('line36b');

        // Part VI
        const l38 = l13 + l21 + l30 + l37;

        this.scheduleForm.patchValue({
            line2e: l2e,
            line3: l3,
            line4c: l4c,
            line6: l6,
            line7: l7,
            line8: l8,
            line10: l10,
            line11: l11,
            line12: l12,
            line13: l13,
            line14c: l14c,
            line15: l15,
            line16: l16,
            line18: l18,
            line19: l19,
            line20: l20,
            line21: l21,
            line23: l23,
            line24: l24,
            line25: l25,
            line27: l27,
            line28: l28,
            line29: l29,
            line30: l30,
            line31: l31,
            line33: l33,
            line34: l34,
            line35: l35,
            line37: l37,
            line38: l38
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log(this.scheduleForm.getRawValue());
    }
}
