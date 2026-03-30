import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-f1040s8',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './f1040s8.component.html',
    styleUrls: ['./f1040s8.component.css']
})
export class F1040s8Component implements OnInit {
    scheduleForm!: FormGroup;
    private fb = inject(FormBuilder);

    ngOnInit(): void {
        this.scheduleForm = this.fb.group({
            nameShown: [''],
            ssn: [''],
            // Part I: Child Tax Credit and Credit for Other Dependents
            line1: [null],
            line2a: [null],
            line2b: [null],
            line2c: [null],
            line2d: [null],
            line3: [null],
            line4: [null],
            line5: [null],
            line6: [null],
            line7: [null],
            line8: [null],
            line9: [null],
            line10: [null],
            line11: [null],
            line12: [null],
            line12_no: [false],
            line12_yes: [false],
            line13: [null],
            line14: [null],

            // Part II: Additional Child Tax Credit (ACTC)
            line15: [null],
            line16a: [null],
            line16b: [null],
            line17: [null],
            line18a: [null],
            line18b: [null],
            line19: [null],
            line19_no: [false],
            line19_yes: [false],
            line20: [null],
            line20_no: [false],
            line20_yes: [false],
            line21: [null],
            line22: [null],
            line23: [null],
            line24: [null],
            line25: [null],
            line26: [null],
            line27: [null]
        });

        this.setupCalculations();
    }

    private setupCalculations() {
        // Basic logic for demonstration. Real tax logic is more complex.
        this.scheduleForm.get('line4')?.valueChanges.subscribe(val => {
            const childrenCount = val ? parseInt(val) : 0;
            this.scheduleForm.patchValue({ line5: childrenCount * 2200 }, { emitEvent: false });
        });

        this.scheduleForm.get('line6')?.valueChanges.subscribe(val => {
            const otherCount = val ? parseInt(val) : 0;
            this.scheduleForm.patchValue({ line7: otherCount * 500 }, { emitEvent: false });
        });

        // Add more calculations as needed based on the form logic...
    }

    onSubmit() {
        if (this.scheduleForm.valid) {
            console.log('Form Submitted', this.scheduleForm.getRawValue());
            alert('Form 1040 Schedule 8812 saved locally!');
        }
    }
}
