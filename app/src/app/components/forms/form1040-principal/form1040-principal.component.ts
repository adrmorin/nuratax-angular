import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormAutomationService } from '../../../services/form-automation.service';

@Component({
    selector: 'app-form-1040-principal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form1040-principal.component.html',
    styleUrls: ['./form1040-principal.component.css']
})
export class Form1040PrincipalComponent implements OnInit {
    private fb = inject(FormBuilder);
    private automationService = inject(FormAutomationService);

    taxForm: FormGroup = this.fb.group({
        // Personal Information
        firstName: [''],
        lastName: [''],
        ssn: [''],
        homeAddress: [''],
        aptNo: [''],
        cityTown: [''],
        state: [''],
        zipCode: [''],
        filingStatus: [''],

        // Income - Lines 1a through 1h and 1z
        incomeW2: [''],         // 1a
        line1b: [''],           // 1b Household employee wages
        line1c: [''],           // 1c Tip income
        line1d: [''],           // 1d Medicaid waiver
        line1e: [''],           // 1e Taxable dependent care
        line1f: [''],           // 1f Employer adoption benefits
        line1g: [''],           // 1g Wages from 8919
        line1h: [''],           // 1h Other earned income
        line1z: [''],           // 1z Add 1a–1h
        line2b: [''],           // 2b Taxable interest
        line3b: [''],           // 3b Ordinary dividends
        line4b: [''],           // 4b IRA distributions taxable
        line5b: [''],           // 5b Pensions and annuities taxable
        line6b: [''],           // 6b Social security taxable
        line7: [''],            // 7 Capital gain or loss
        line8: [''],            // 8 Additional income from Sch 1
        line9: [''],            // 9 Total income
        line10: [''],           // 10 Adjustments to income
        line11: [''],           // 11 AGI
        line12: [''],           // 12 Standard/itemized deduction
        line13: [''],           // 13 QBI deduction
        line14: [''],           // 14 Add 12+13
        line15: [''],           // 15 Taxable income

        // Tax and Credits
        line16: [''],           // 16 Tax
        line17: [''],           // 17 AMT
        line18: [''],           // 18 Add 16+17
        line19: [''],           // 19 Child tax credit
        line20: [''],           // 20 Schedule 3 line 8
        line21: [''],           // 21 Add 19+20
        line22: [''],           // 22 Subtract 21 from 18
        line23: [''],           // 23 Other taxes from Sch 2
        line24: [''],           // 24 Total tax

        // Payments
        line25a: [''],          // 25a Federal tax withheld W-2
        line25b: [''],          // 25b Federal tax withheld 1099
        line25c: [''],          // 25c Other federal tax withheld
        line26: [''],           // 26 2025 estimated tax payments
        line27: [''],           // 27 Earned income credit
        line28: [''],           // 28 Additional child tax credit
        line29: [''],           // 29 American opportunity credit
        line31: [''],           // 31 Schedule 3 line 15
        line32: [''],           // 32 Add 27-31
        line33: [''],           // 33 Total payments (25d+26+32)

        // Refund
        line34: [''],           // 34 Overpayment
        line35a: [''],          // 35a Refund amount
        routingNumber: [''],    // 35b Routing number
        accountType: [''],      // 35c Checking/Savings
        accountNumber: [''],    // 35d Account number
        line36: [''],           // 36 Amount applied to 2026

        // Amount Owed
        line37: [''],           // 37 Amount owed
        line38: [''],           // 38 Estimated tax penalty

        // Third Party
        thirdPartyDesignee: [false],
        designeeName: [''],
        designeePhone: [''],
        designeePIN: [''],

        // Sign Here
        occupation: [''],
        spouseOccupation: [''],
        identityProtectionPIN: [''],
        spouseIdentityProtectionPIN: [''],

        // Paid Preparer
        preparerName: [''],
        preparerPTIN: [''],
        selfEmployed: [false],
        prepFirmName: [''],
        prepFirmPhone: [''],
        prepFirmAddress: [''],
        prepFirmEIN: ['']
    });

    ngOnInit() {
        this.automationService.fieldUpdate$.subscribe(({ field, value }) => {
            if (this.taxForm.contains(field)) {
                this.taxForm.get(field)?.setValue(value);
            }
        });
    }
}
