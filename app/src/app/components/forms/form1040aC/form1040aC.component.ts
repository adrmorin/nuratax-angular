import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TaxDataService } from '../../../services/tax-data.service';
import { ChatFormsComponent } from '../chatforms/chatforms.component';

type ExpenseValues = Record<string, number>;

@Component({
    selector: 'app-form-1040a-c',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ChatFormsComponent],
    templateUrl: './form1040aC.component.html',
    styleUrls: ['./form1040aC.component.css']
})
// ChatFormsComponent is integrated at the bottom of the template for live assistance.
export class Form1040acComponent implements OnInit {
    private fb = inject(FormBuilder);
    private taxDataService = inject(TaxDataService);
    taxForm: FormGroup;
    currentYear = 2026;

    nereaAdvice = {
        part1: 'Reconcilia todos tus formularios 1099. Si eres "Empleado Estatutario", ¡puedes deducir gastos directamente aquí! Esto reduce tu ingreso imponible sin afectar la deducción estándar.',
        part2: 'Las suscripciones de software y apps para el negocio son 100% deducibles en 2026. Documentar estas herramientas digitales es clave para sustentar la operatividad de tu negocio ante el IRS.',
        part3: 'Si tus ingresos son menores a $26M, podrías calificar para métodos de inventario simplificados. Esto mejora tu flujo de caja al permitirte deducir costos de inventario de forma más flexible.',
        part4: '¡Mantén un registro digital! El IRS está auditando más los gastos de vehículos este año. Un log preciso es tu mejor defensa para maximizar la deducción por millaje ($0.67/milla).',
        part5: 'No olvides las pequeñas cuotas de membresía o suscripciones profesionales; todo suma. Estas deducciones ordinarias demuestran que te mantienes actualizado en tu industria.'
    };

    constructor() {
        this.taxForm = this.fb.group({
            // Informacion del Negocio
            ownerName: ['', Validators.required],
            ssn: ['', Validators.required],

            // Header Fields A-J
            principalBusiness: [''],      // A
            principalProduct: [''],       // A (cont)
            businessCode: [''],           // B
            businessName: [''],           // C
            ein: [''],                    // D
            businessAddress: [''],        // E
            cityStateZip: [''],           // E (cont)
            accountingMethod: ['1'],      // F (1=Efectivo, 2=Acumulación, 3=Otro)
            accountingMethodOther: [''],  // F (detalles)
            startedBusiness2026: [false], // G
            materiallyParticipated: [true], // H
            hiredWorkers: [false],        // I
            requiredToSend1099: [false],  // I (sub)
            sent1099: [false],            // J

            // Parte I - Ingreso
            grossReceipts: [0],           // 1
            isStatutoryEmployee: [false], // 1 (checkbox)
            returns: [0],                 // 2
            line3: [{ value: 0, disabled: true }], // 3 (1-2)
            // line 4 comes from cogs.totalCogs (Part III)
            grossProfit: [{ value: 0, disabled: true }], // 5 (3-4)
            otherIncome: [0],             // 6
            grossIncome: [{ value: 0, disabled: true }], // 7 (5+6)

            // Parte II - Gastos
            expenses: this.fb.group({
                advertising: [0],          // 8
                carAndTruck: [0],          // 9
                commissions: [0],          // 10
                contractLabor: [0],        // 11
                depletion: [0],            // 12
                depreciation: [0],         // 13
                employeeBenefits: [0],     // 14
                insurance: [0],            // 15
                interestMortgage: [0],      // 16a
                interestOther: [0],         // 16b
                legalProfessional: [0],     // 17
                office: [0],               // 18
                pensionPlans: [0],          // 19
                rentVehicles: [0],          // 20a
                rentProperty: [0],          // 20b
                repairs: [0],              // 21
                supplies: [0],             // 22
                taxesLicenses: [0],         // 23
                travel: [0],                // 24a
                meals: [0],                 // 24b
                utilities: [0],            // 25
                wages: [0],                // 26
                otherExpenses: [0],        // 27a (From Part V)
                energyDeduction: [0]       // 27b
            }),
            totalExpenses: [{ value: 0, disabled: true }], // 28
            tentativeProfit: [{ value: 0, disabled: true }], // 29

            // Line 30 - Simplified Method Details
            homeOfficeSimplified: [false],
            sqFtHome: [0],
            sqFtBusiness: [0],
            homeOfficeDeduction: [0],     // 30

            netProfit: [{ value: 0, disabled: true }],    // 31

            // Line 32 - Loss limitations
            allInvestmentAtRisk: [true],  // 32a
            someInvestmentNotAtRisk: [false], // 32b

            // Parte III - Costo de Mercancías Vendidas (COGS)
            cogs: this.fb.group({
                inventoryMethod: ['cost'], // 33 (cost, market, other)
                inventoryMethodOther: [''],
                inventoryChange: [false],   // 34
                inventoryStart: [0],        // 35
                purchases: [0],             // 36
                laborCost: [0],             // 37
                materials: [0],             // 38
                otherCosts: [0],            // 39
                sum35to39: [{ value: 0, disabled: true }], // 40
                inventoryEnd: [0],          // 41
                totalCogs: [{ value: 0, disabled: true }]  // 42
            }),

            // Parte IV - Información sobre Su Vehículo
            vehicle: this.fb.group({
                datePlaced: [''],
                businessMiles: [0],
                commutingMiles: [0],
                otherMiles: [0],
                availablePersonal: [false],
                anotherVehicle: [false],
                evidence: [false],
                writtenEvidence: [false]
            }),

            // Parte V - Otros Gastos
            otherExpensesList: this.fb.array([this.createOtherExpenseRow()])
        });

        this.taxForm.valueChanges.subscribe(() => {
            this.calculateValues();
            this.taxDataService.saveTaxData(this.taxForm.getRawValue());
        });
    }

    ngOnInit(): void {
        const savedData = this.taxDataService.loadTaxData();
        if (savedData) {
            this.patchFormWithSavedData(savedData);
        }
    }

    private patchFormWithSavedData(data: Record<string, unknown>): void {
        // Handle FormArray specifically
        const otherExpenses = data['otherExpensesList'];
        if (Array.isArray(otherExpenses)) {
            while (this.otherExpensesList.length > 0) {
                this.otherExpensesList.removeAt(0);
            }
            otherExpenses.forEach(() => {
                this.addOtherExpense();
            });
        }
        this.taxForm.patchValue(data, { emitEvent: false });
        this.calculateValues();
    }

    createOtherExpenseRow(): FormGroup {
        return this.fb.group({
            description: [''],
            amount: [0]
        });
    }

    get otherExpensesList(): FormArray {
        return this.taxForm.get('otherExpensesList') as FormArray;
    }

    addOtherExpense(): void {
        this.otherExpensesList.push(this.createOtherExpenseRow());
    }

    removeOtherExpense(index: number): void {
        this.otherExpensesList.removeAt(index);
    }

    calculateValues(): void {
        const rawValue = this.taxForm.getRawValue();

        // 1. Calcular Parte V
        const totalOtherExpenses = rawValue.otherExpensesList?.reduce(
            (acc: number, val: { amount: number }) => acc + (Number(val.amount) || 0),
            0
        ) || 0;

        // 2. Calcular Parte III (COGS)
        const c = rawValue.cogs || { inventoryStart: 0, purchases: 0, laborCost: 0, materials: 0, otherCosts: 0, inventoryEnd: 0 };
        const line40 = (Number(c.inventoryStart) || 0) + (Number(c.purchases) || 0) +
            (Number(c.laborCost) || 0) + (Number(c.materials) || 0) + (Number(c.otherCosts) || 0);
        const line42 = line40 - (Number(c.inventoryEnd) || 0);

        // 3. Calcular Parte I (Ingreso)
        const line1 = Number(rawValue.grossReceipts) || 0;
        const line2 = Number(rawValue.returns) || 0;
        const line3 = line1 - line2;
        const line4 = line42;
        const line5 = line3 - line4;
        const line6 = Number(rawValue.otherIncome) || 0;
        const line7 = line5 + line6;

        // 4. Calcular Parte II (Gastos)
        const ex: ExpenseValues = rawValue.expenses;
        const baseExpenses = Object.keys(ex).reduce((acc: number, key: string) => {
            if (key === 'otherExpenses') return acc;
            return acc + (Number(ex[key]) || 0);
        }, 0);

        const totalExpenses = baseExpenses + totalOtherExpenses;

        // 5. Ganancia Tentativa (29)
        const tentativeProfit = line7 - totalExpenses;

        // 6. Home Office (30) - Simplified Method: $5 per sq ft up to 300 sq ft
        let homeOfficeDeduction = Number(rawValue.homeOfficeDeduction) || 0;
        if (rawValue.homeOfficeSimplified) {
            const bizSqFt = Math.min(Number(rawValue.sqFtBusiness) || 0, 300);
            homeOfficeDeduction = bizSqFt * 5;
        }

        // 7. Ganancia Neta (31)
        const netProfit = tentativeProfit - homeOfficeDeduction;

        this.taxForm.patchValue({
            line3: line3,
            grossProfit: line5,
            grossIncome: line7,
            expenses: { otherExpenses: totalOtherExpenses },
            totalExpenses: totalExpenses,
            tentativeProfit: tentativeProfit,
            homeOfficeDeduction: homeOfficeDeduction,
            netProfit: netProfit,
            cogs: {
                sum35to39: line40,
                totalCogs: line42
            }
        }, { emitEvent: false });
    }

    onSubmit(): void {
        if (this.taxForm.valid) {
            console.log('Form Submitted', this.taxForm.getRawValue());
        } else {
            this.markFormGroupTouched(this.taxForm);
        }
    }

    private markFormGroupTouched(formContainer: FormGroup | FormArray): void {
        Object.values(formContainer.controls).forEach(control => {
            control.markAsTouched();
            if (control instanceof FormGroup || control instanceof FormArray) {
                this.markFormGroupTouched(control);
            }
        });
    }
}
