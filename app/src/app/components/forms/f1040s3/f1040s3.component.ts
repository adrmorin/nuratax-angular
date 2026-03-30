import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-f1040s3',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './f1040s3.component.html',
    styleUrls: ['./f1040s3.component.css']
})
export class F1040s3Component implements OnInit {
    scheduleForm!: FormGroup;
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.scheduleForm = this.fb.group({
            nameShown: [''],
            ssn: [''],
            // Part I: Nonrefundable Credits
            line1: [null],
            line2: [null],
            line3: [null],
            line4: [null],
            line5a: [null],
            line5b: [null],
            line6a: [null],
            line6b: [null],
            line6c: [null],
            line6d: [null],
            line6f: [null],
            line6g: [null],
            line6h: [null],
            line6i: [null],
            line6j: [null],
            line6k: [null],
            line6l: [null],
            line6m: [null],
            line6z_type: [''],
            line6z: [null],
            line7: [null],
            line8: [{ value: null, disabled: true }],

            // Part II: Other Payments and Refundable Credits
            line9: [null],
            line10: [null],
            line11: [null],
            line12: [null],
            line13: [null],
            line13Check: [false],
            line14: [null],
            line15: [{ value: null, disabled: true }]
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

        // Calculate line7 = sum lines 6a to 6z
        const line6Sources = ['line6a', 'line6b', 'line6c', 'line6d', 'line6f', 'line6g', 'line6h', 'line6i', 'line6j', 'line6k', 'line6l', 'line6m', 'line6z'];
        line6Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line7: sumLines(line6Sources) }, { emitEvent: true });
            });
        });

        // Calculate line8 = sum lines 1 to 5b and 7
        const line8Sources = ['line1', 'line2', 'line3', 'line4', 'line5a', 'line5b', 'line7'];
        line8Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line8: sumLines(line8Sources) }, { emitEvent: true });
            });
        });

        // Calculate line15 = sum lines 9 to 14
        const line15Sources = ['line9', 'line10', 'line11', 'line12', 'line13', 'line14'];
        line15Sources.forEach(l => {
            this.scheduleForm.get(l)?.valueChanges.subscribe(() => {
                this.scheduleForm.patchValue({ line15: sumLines(line15Sources) }, { emitEvent: true });
            });
        });
    }

    onSubmit() {
        if (this.scheduleForm.valid) {
            console.log('Form Submitted', this.scheduleForm.getRawValue());
            alert('Form 1040 Schedule 3 saved locally!');
        }
    }
}
