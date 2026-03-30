import { Injectable, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';

export interface AutomatedStep {
    id: string;
    section: string;
    question: string;
    field: string;
    type: 'text' | 'checkbox' | 'number' | 'ssn';
    anchorId?: string; // ID for scrolling
}

@Injectable({
    providedIn: 'root'
})
export class FormAutomationService {
    // Current index in the automation flow
    private currentStepIndex = signal(0);

    // Subject to push updates to the form
    private fieldUpdateSource = new Subject<{ field: string, value: string | number | boolean }>();
    fieldUpdate$ = this.fieldUpdateSource.asObservable();

    // The sequence of questions for Form 1040
    private steps: AutomatedStep[] = [
        // 1. Datos principales
        { id: 'first_name', section: 'Datos principales', question: '¿Podrías decirme tu nombre y segundo nombre?', field: 'firstName', type: 'text', anchorId: 'irs-header' },
        { id: 'last_name', section: 'Datos principales', question: 'Gracias. ¿Y tu apellido?', field: 'lastName', type: 'text', anchorId: 'irs-header' },
        { id: 'ssn', section: 'Datos principales', question: 'Perfecto. Para avanzar, necesito tu número de Seguro Social.', field: 'ssn', type: 'ssn', anchorId: 'irs-header' },
        { id: 'home_address', section: 'Datos principales', question: '¿Cuál es tu dirección de residencia actual?', field: 'homeAddress', type: 'text', anchorId: 'irs-header' },

        // 2. Dependents
        { id: 'has_dependents', section: 'Dependents', question: '¿Tienes dependientes que declarar este año?', field: 'hasDependents', type: 'checkbox', anchorId: 'irs-dependents' },

        // 3. Income
        { id: 'income_w2', section: 'Income', question: 'Hablemos de tus ingresos. ¿Cuál fue el total reflejado en tu Formulario W-2?', field: 'incomeW2', type: 'number', anchorId: 'irs-income' },

        // 4. Tax credits (simplified for now)
        { id: 'child_tax_credit', section: 'Tax credits', question: '¿Deseas solicitar el Crédito Tributario por Hijos?', field: 'childTaxCredit', type: 'checkbox', anchorId: 'irs-tax-credits' },

        // 5. Payments
        { id: 'tax_withheld', section: 'Payments and Refundable Credits', question: '¿Cuánto te retuvieron de impuestos federales este año?', field: 'taxWithheld', type: 'number', anchorId: 'irs-payments' },

        // 6. Refund
        { id: 'refund_method', section: 'Refund', question: 'Si tienes un reembolso, ¿prefieres depósito directo o cheque?', field: 'refundMethod', type: 'text', anchorId: 'irs-refund' },

        // 7. Amount Owe
        { id: 'owe_payment', section: 'Amount You Owe', question: 'En caso de que resulte un monto a pagar, ¿cómo preferirías realizar el pago?', field: 'owePayment', type: 'text', anchorId: 'irs-owe' },

        // 8. Third Party
        { id: 'third_party_designee', section: 'Third Party Designee', question: '¿Deseas autorizar a otra persona para discutir esta declaración con el IRS?', field: 'thirdPartyDesignee', type: 'checkbox', anchorId: 'irs-designee' }
    ];

    currentStep = computed(() => this.steps[this.currentStepIndex()]);
    isCompleted = computed(() => this.currentStepIndex() >= this.steps.length);

    nextStep() {
        if (this.currentStepIndex() < this.steps.length - 1) {
            this.currentStepIndex.update(idx => idx + 1);
        }
    }

    updateField(value: string | number | boolean) {
        const step = this.currentStep();
        if (step) {
            let processedValue = value;

            // Basic heuristic for checkboxes
            if (step.type === 'checkbox' && typeof value === 'string') {
                const normalized = value.toLowerCase();
                processedValue = normalized.includes('sí') || normalized.includes('si') || normalized.includes('yes') || normalized.includes('claro');
            }

            this.fieldUpdateSource.next({ field: step.field, value: processedValue });
        }
    }

    reset() {
        this.currentStepIndex.set(0);
    }
}
