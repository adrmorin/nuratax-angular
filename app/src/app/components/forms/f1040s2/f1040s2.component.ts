import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-f1040s2',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './f1040s2.component.html',
    styleUrls: ['./f1040s2.component.css']
})
export class F1040s2Component implements OnInit {
    scheduleForm!: FormGroup;

    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.scheduleForm = this.fb.group({
            nameShown: [''],
            ssn: [''],
            // Part I
            line1a: [null],
            line1b: [null],
            line1c: [null],
            line1d: [null],
            line1e: [null],
            line1eRadio: [''], // For the checkboxes (i, ii, iii, iv)
            line1f: [null],
            line1fRadio: [''], // For the checkboxes
            line1y: [null],
            line1z: [{ value: null, disabled: true }],
            line2: [null],
            line3: [{ value: null, disabled: true }],

            // Part II
            line4: [null],
            line4Check1: [false],
            line4Check2: [false],
            line4Check3: [false],
            line4Text: [''],
            line5: [null],
            line6: [null],
            line7: [{ value: null, disabled: true }],
            line8: [null],
            line8Check: [false],
            line9: [null],
            line10: [null],
            line11: [null],
            line12: [null],
            line13: [null],
            line14: [null],
            line15: [null],
            line16: [null],

            line17a_type: [''], // Text field
            line17a: [null],
            line17b: [null],
            line17c: [null],
            line17d: [null],
            line17e: [null],
            line17f: [null],
            line17g: [null],
            line17h: [null],
            line17i: [null],
            line17j: [null],
            line17k: [null],
            line17l: [null],
            line17m: [null],
            line17n: [null],
            line17o: [null],
            line17p: [null],
            line17q: [null],
            line17z_type: [''], // Text field
            line17z: [null],

            line18: [{ value: null, disabled: true }],
            line19: [null],
            line20: [null],
            line21: [{ value: null, disabled: true }]
        });

        this.setupCalculations();
    }

    private setupCalculations() {
        const sumLines = (lines: string[]) => {
            return lines.reduce((acc, current) => {
                const val = this.scheduleForm.get(current)?.value;
                return acc + (val ? parseFloat(val) : 0);
            }, 0);
        };

        // Calculate line1z
        const line1Sources = ['line1a', 'line1b', 'line1c', 'line1d', 'line1e', 'line1f', 'line1y'];
        line1Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line1z: sumLines(line1Sources) }, { emitEvent: true });
            });
        });

        // Calculate line3 = line1z + line2
        const line3Sources = ['line1z', 'line2'];
        line3Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line3: sumLines(line3Sources) }, { emitEvent: true });
            });
        });

        // Calculate line7 = line5 + line6
        const line7Sources = ['line5', 'line6'];
        line7Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line7: sumLines(line7Sources) }, { emitEvent: true });
            });
        });

        // Calculate line18 = sum 17a-z
        const line17Sources = ['line17a', 'line17b', 'line17c', 'line17d', 'line17e', 'line17f', 'line17g', 'line17h', 'line17i', 'line17j', 'line17k', 'line17l', 'line17m', 'line17n', 'line17o', 'line17p', 'line17q', 'line17z'];
        line17Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line18: sumLines(line17Sources) }, { emitEvent: true });
            });
        });

        // Calculate line21 = lines 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19
        const line21Sources = ['line4', 'line7', 'line8', 'line9', 'line10', 'line11', 'line12', 'line13', 'line14', 'line15', 'line16', 'line18', 'line19'];
        line21Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line21: sumLines(line21Sources) }, { emitEvent: true });
            });
        });
    }

    onSubmit() {
        // Only implemented minimal action
        if (this.scheduleForm.valid) {
            console.log('Form Submitted', this.scheduleForm.getRawValue());
            alert('Form 1040 Schedule 2 saved locally!');
        }
    }
}
