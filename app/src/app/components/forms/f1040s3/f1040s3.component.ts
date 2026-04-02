import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-f1040s3',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './f1040s3.component.html',
    styleUrls: ['./f1040s3.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class F1040s3Component {
    private fb = inject(FormBuilder);
    
    scheduleForm: FormGroup = this.fb.group({
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
        
        // Part II: Other Payments and Refundable Credits
        line9: [null],
        line10: [null],
        line11: [null],
        line12: [null],
        line13: [null],
        line14: [null]
    });

    // Signals for calculations
    private getVal(controlName: string): number {
        const val = this.scheduleForm.get(controlName)?.value;
        return val ? parseFloat(val) : 0;
    }

    // Convert form value changes to signals for reactive computation
    // We can use toSignal on valueChanges or just use the form values in a computed if we expose them
    // For simplicity in this refactor, I'll use a signal that updates on form changes
    formValues = toSignal(this.scheduleForm.valueChanges, { initialValue: this.scheduleForm.value });

    line7 = computed(() => {
        const vals = this.formValues();
        const sources = ['line6a', 'line6b', 'line6c', 'line6d', 'line6f', 'line6g', 'line6h', 'line6i', 'line6j', 'line6k', 'line6l', 'line6m', 'line6z'];
        return sources.reduce((acc, curr) => acc + (vals[curr] ? parseFloat(vals[curr]) : 0), 0);
    });

    line8 = computed(() => {
        const vals = this.formValues();
        const line7Val = this.line7();
        const sources = ['line1', 'line2', 'line3', 'line4', 'line5a', 'line5b'];
        const sum = sources.reduce((acc, curr) => acc + (vals[curr] ? parseFloat(vals[curr]) : 0), 0);
        return sum + line7Val;
    });

    line15 = computed(() => {
        const vals = this.formValues();
        const sources = ['line9', 'line10', 'line11', 'line12', 'line13', 'line14'];
        return sources.reduce((acc, curr) => acc + (vals[curr] ? parseFloat(vals[curr]) : 0), 0);
    });



    onSubmit() {
        if (this.scheduleForm.valid) {
            console.log('Form Submitted', {
                ...this.scheduleForm.getRawValue(),
                line7: this.line7(),
                line8: this.line8(),
                line15: this.line15()
            });
            alert('Form 1040 Schedule 3 saved locally!');
        }
    }
}

