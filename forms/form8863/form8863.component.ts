import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaxDataService } from '../../app/src/app/services/tax-data.service';
import { ChatFormsComponent } from '../../app/src/app/components/forms/chatforms/chatforms.component';

@Component({
    selector: 'app-form-8863',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form8863.component.html',
    styleUrls: ['./form8863.component.css']
})
export class Form8863Component implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        aotc: 'El Crédito de Oportunidad Americana (AOTC) es hasta $2,500 por estudiante elegible. Requiere al menos 4 años de educación postsecundaria.',
        llc: 'El Crédito de Aprendizaje Permanente (LLC) es hasta $2,000 por declaración. Para estudiantes con educación postsecundaria parcial.',
        income: 'Para 2026, los créditos se reducen gradualmente para: Solteros $80,000-$90,000, Casados $160,000-$180,000. above $90,000/$180,000 no hay crédito.',
        qualified: 'Los gastos calificados incluyen matrícula, honorarios, libros requeridos. Alojamiento y comida no califican.',
        both: 'No puedes reclamar ambos créditos para el mismo estudiante en el mismo año. El AOTC generalmente es más valioso.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Student 1
            student1Name: [''],
            student1SSN: [''],
            student1QualifiedExpenses: [0],
            student1AOTC: [0],
            student1LLC: [0],
            student1Credit: [0],

            // Student 2
            student2Name: [''],
            student2SSN: [''],
            student2QualifiedExpenses: [0],
            student2AOTC: [0],
            student2LLC: [0],
            student2Credit: [0],

            // AGI Calculation
            modifiedAGI: [0],
            filingStatus: ['single'],
            aotcPhaseoutStart: [80000],
            aotcPhaseoutEnd: [90000],
            aotcReduction: [0],

            // LLC
            llcPhaseoutStart: [160000],
            llcPhaseoutEnd: [180000],
            llcReduction: [0],

            // Credits
            totalAOTC: [0],
            totalLLC: [0],
            totalEducationCredit: [0],
            priorYearCarryforward: [0],
            netEducationCredit: [0]
        });

        this.taxForm.valueChanges.subscribe(() => {
            this.calculateValues();
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.taxForm.patchValue(savedData, { emitEvent: false });
            this.calculateValues();
        }
    }

    calculateValues(): void {
        const v = this.taxForm.getRawValue();
        
        const magi = Number(v.modifiedAGI) || 0;
        const isMarried = v.filingStatus === 'married';
        
        let aotcReduction = 0;
        if (magi > v.aotcPhaseoutStart) {
            const maxPhaseout = isMarried ? 180000 : 90000;
            if (magi < maxPhaseout) {
                aotcReduction = (magi - v.aotcPhaseoutStart) / 10000 * 0.1;
            } else {
                aotcReduction = 1;
            }
        }

        let totalAOTC = (Number(v.student1AOTC) || 0) + (Number(v.student2AOTC) || 0);
        totalAOTC = totalAOTC * (1 - aotcReduction);

        let totalLLC = (Number(v.student1LLC) || 0) + (Number(v.student2LLC) || 0);
        
        const totalCredit = totalAOTC + totalLLC;
        const netCredit = totalCredit + (Number(v.priorYearCarryforward) || 0);

        this.taxForm.patchValue({
            aotcReduction: aotcReduction,
            totalAOTC: totalAOTC,
            totalLLC: totalLLC,
            totalEducationCredit: totalCredit,
            netEducationCredit: netCredit
        }, { emitEvent: false });
    }

    onSubmit(): void {
        console.log('Form 8863 Submitted', this.taxForm.getRawValue());
    }
}