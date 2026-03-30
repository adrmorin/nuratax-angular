import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OpenaiService } from '../../services/openai.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { FillFormsService } from '../../services/fill-forms.service';
import { NeuralSwal } from '../../services/neuraltax-swal';
import { ChatbotTaxComponent } from './chatbot-tax/chatbot-tax.component';
import { TaxReturnResponseDto } from '../../interfaces/taxReturnResponse-interfaces';

@Component({
    selector: 'app-tax-declaration',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './tax-declaration.component.html',
    styleUrl: './tax-declaration.component.scss'
})
export class TaxDeclarationComponent implements OnInit {
    selectedDeclarationType: string | null = null;
    selectedIncomeTypes: Set<string> = new Set();
    taxForm: FormGroup;
    businessTaxForm: FormGroup;
    showIrsQuestion = false;
    showErrorDescription = false;
    showDigitalAssetsForm = false;
    showGainsLossesForm = false;
    transactions: any[] = [];
    amountOwed = 0;
    isChecked = false;
    show28RateGainForm = false;
    showIntroModal = true;
    chatbotCompleted = false;
    showExpenses: boolean[] = [];
    promptMessage = '';
    uploadedFiles: File[] = [];
    private readonly CHAT_SESSION_KEY = 'chatbot_tax_session_id';

    constructor( private fb: FormBuilder, private fillFormService: FillFormsService, private router: Router) {
      this.taxForm = this.createForm();
      this.businessTaxForm = this.createBusinessForm();
    }

    continueFromModal(): void {
        this.showIntroModal = false;
    }

    cancelAndReturnHome(): void {
        this.showIntroModal = false;
        this.router.navigate(['/']);
    }

    reopenChatbot(useExistingSession: boolean): void {
        if (!useExistingSession) {
            localStorage.removeItem(this.CHAT_SESSION_KEY);
        }
        this.showIntroModal = true;
    }

    onChatbotClosed(): void {
        // Hide the chatbot modal when the child component requests to close
        this.showIntroModal = false;
    }

    onChatbotCompleted(done: boolean): void {
        this.chatbotCompleted = done;
    }

    ngOnInit(): void {
        console.log("Tax Declaration");

        // Initialize forms
        this.taxForm = this.createForm();
        this.businessTaxForm = this.createBusinessForm();

        // Default to "Personal" form on load
        this.selectedDeclarationType = 'Personal';

        // ⬇️ Detectar cambios en Residency Status
        this.taxForm.get('residencyStatus')?.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(value => {
                this.onResidencyStatusChange(value);
                if (value !== 'Resident') {
                    this.taxForm.get('presidentialFundSpouse')?.setValue(false);
                }
            });

        // ⬇️ Manejo de Capital Gain or Loss Checkbox
        this.taxForm.get('capitalGainOrLossCheckbox')?.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe((isChecked) => {
                const amountControl = this.taxForm.get('capitalGainOrLossAmount');
                if (isChecked) {
                    amountControl?.disable();
                    amountControl?.reset();
                } else {
                    amountControl?.enable();
                }
            });

        // ⬇️ Recalcular línea 37 cuando cambien Total Tax o Total Payments
        this.taxForm.get('totalTax')?.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(() => this.calculateAmountOwed());

        this.taxForm.get('totalPayments')?.valueChanges
            .pipe(distinctUntilChanged())
            .subscribe(() => this.calculateAmountOwed());

        // ⬇️ Manejo centralizado de cambios en líneas de impuestos
        const line13Controls = ['businessIncomeDeduction', 'estateTrustExemptions'];
        line13Controls.forEach(control => {
            this.taxForm.get(control)?.valueChanges
                .pipe(distinctUntilChanged())
                .subscribe(() => this.updateLine13c());
        });

        const line23Controls = ['taxOnIncomeNotConnected', 'otherTaxesSchedule2', 'transportationTax'];
        line23Controls.forEach(control => {
            this.taxForm.get(control)?.valueChanges
                .pipe(distinctUntilChanged())
                .subscribe(() => this.updateLine23d());
        });

        // ⬇️ Manejo centralizado de cambios en Federal Tax Withheld
        const federalTaxControls = ['federalTaxWithheldW2', 'federalTaxWithheld1099', 'federalTaxWithheldOther'];
        federalTaxControls.forEach(control => {
            this.taxForm.get(control)?.valueChanges
                .pipe(distinctUntilChanged())
                .subscribe(() => this.calculateFederalTaxTotal());
        });

        const installmentSalesDetails = this.taxForm.get('incomeInfo.propertySalesSection.installmentSalesDetails') as FormArray;

        installmentSalesDetails.controls.forEach((group: AbstractControl) => {
            group.get('recaptureCode')?.valueChanges.subscribe((code: string) => {
                if (code === '1252') {
                    group.get('soilWaterClearingExpenses')?.enable();
                } else {
                    group.get('soilWaterClearingExpenses')?.disable();
                }

                if (code === '1254') {
                    group.get('intangibleDrillingCosts')?.enable();
                } else {
                    group.get('intangibleDrillingCosts')?.disable();
                }
            });
        });

        // Inicializa el array showExpenses según la cantidad inicial de negocios
        const count = this.scheduleCInfo.length;
        this.showExpenses = Array(count).fill(false);

    }

    createForm(): FormGroup {
        const defaultTypes = ['Employee'];
        this.selectedIncomeTypes = new Set(defaultTypes);
        return this.fb.group({
            // 🟢 Declaration Type
            declarationType: this.fb.control(defaultTypes),

            // 🟢 SECCIÓN 1 - Personal Info + Spouse + Filing Status + Dependents + Care Providers
            personalInfo: this.fb.group({
                // [1] Datos básicos del contribuyente
                fullName: ['Tara', Validators.required],
                lastName: ['Black', Validators.required],
                phone: ['7778885566', [Validators.required, Validators.pattern(/^\d{10}$/)]],
                ssn: ['400001032', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
                dob: ['1998-05-15', Validators.required],
                email: ['husband@yahoo.com', [Validators.required, Validators.email]],
                isBlind: [false],
                residencyStatus: ['ResidentAlien', Validators.required],
                yourOccupation: ['Software Engineer', Validators.required],
                // [2] Filing Status y Residency
                filingStatus: ['Single', Validators.required],
                // [3] Spouse Info
                spouse: this.fb.group({
                    spouseFAndMName: [''],
                    spouseLastName: [''],
                    spousePhone: ['', Validators.pattern(/^\d{10}$/)],
                    spouseSsn: ['', [Validators.minLength(9), Validators.maxLength(9)]],
                    spouseDob: [''],
                    spouseEmail: ['', Validators.email],
                    spouseIsBlind: [false],
                    spouseGrossIncome: [''],
                    spouseRetirementPlan: [false],
                    spouseOccupation: [''],
                }),

                noDependentName: [''],
                livedWithSpouseAnyTime: ['No'],

                // [4] Dependents
                usedDeemedIncome: ['No'],
                paidStudentLoanInterest: ['No'],
                studentLoanInterestPaid: [0],
                dependentSection: this.fb.group({
                    hasDependents: ['No', Validators.required],
                    dependentCareBenefits: ['No'],
                    studentOrDisabled: ['No'],
                    specialCareEligibility: [false],
                    dependents: this.fb.array([
                        this.fb.group({
                            firstName: [''],
                            lastName: [''],
                            ssn: ['', [Validators.minLength(9), Validators.maxLength(9)]],
                            relationship: [''],
                            childTaxCredit: [false],
                            creditForOtherDependents: [false],
                            livedWithYouMoreThanHalf: [false], // (5a)
                            livedInUS: [false],
                            fullTimeStudent: [false],
                            permanentlyDisabled: [false],
                            under13OrDisabled: [false],
                            qualifiedExpenses: [0, Validators.min(0)]
                        }),
                    ]),
                    careProviders: this.fb.array([
                        this.fb.group({
                            providerName: [''],
                            providerAddress: [''],
                            identifyingNumber: [''],
                            householdEmployee: [''],
                            amountPaid: [0],
                        }),
                    ]),
                }),
            }),

            // 🟢 SECCIÓN 2 – Dirección y Contacto
            contactInfo: this.fb.group({
                // 1. Home Address
                homeAddress: ['17 Lexington Drive', Validators.required],
                aptNo: [''],
                city: ['Cincinnati', Validators.required],
                state: ['OH', Validators.required],
                zipCode: ['45223', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],

                // 🌍 2. Foreign Address
                foreignCountry: [''],
                foreignState: [''],
                foreignPostalCode: [''],

                // 🔄 3. Address Change
                changedAddress: ['No', Validators.required],
                previousAddress: this.fb.group({
                    previousaddress: [''],
                    previousaptNo: [''],
                    previouscity: [''],
                    previousstate: [''],
                    previouszipCode: ['']
                }),

                // 🇺🇸 4. Presidential Election Campaign
                presidentialFundYou: [false],
                presidentialFundSpouse: [false],
            }),

            // 🟢 SECCIÓN 3 - Employment and Main Income
            incomeInfo: this.fb.group({
                // 🟢 ACTIVOS DIGITALES
                digitalAssetsSection: this.fb.group({
                    digitalAssets: ['No', Validators.required],
                    transactionCategory: ['A'],
                    digitalAssetsDetails: this.fb.array([
                        this.fb.group({
                            description: ['Default Asset 1'],
                            acquisitionDate: ['2025-01-01'],
                            saleDate: ['2025-01-10'],
                            salePrice: [0, Validators.min(0)],
                            costBasis: [0, Validators.min(0)],
                            adjustment: [0],
                            category: ['A'],
                            codes: ['D123']
                        }),
                    ]),
                }),
                // 🟢 Agricultural Gains (Schedule SE)
                scheduleSESection: this.fb.group({
                    hasAgriculturalGains: ['No', Validators.required],
                    gainLossesFarming: ['Yes'],
                    netFarmProfit: ['0'],
                    grossFarmProfit: ['0'],
                    lossFarmProfit: ['0'],
                    conservationReservePayments: ['0'],
                }),
                // 🟢 Other Gains Losses
                otherGainsLossesSection: this.fb.group({
                    otherGainsLosses: ['No', Validators.required],
                    gainsLossesDetails: this.fb.array([
                        this.fb.group({
                            description: ['111 shares of ABC'],
                            acquisitionDate: ['2023-01-01'],
                            saleDate: ['2024-01-10'],
                            salePrice: [0, Validators.min(0)],
                            costBasis: [0, Validators.min(0)],
                            adjustment: [0],
                            category: ['A'],
                            codes: ['Z123']
                        }),
                    ]),
                }),
                // 🟢 Qualified Opportunity Fund
                qualifiedOpportunityFundSection: this.fb.group({
                    disposedQOFInvestment: ['No', Validators.required],
                    qofTransactions: this.fb.array([
                        this.fb.group({
                            fundName: ['Opportunity Growth Fund'],
                            fundEIN: ['12-3456789'],
                            acquisitionDate: ['2020-05-01'],
                            saleDate: ['2024-03-10'],
                            saleProceeds: [70000, Validators.min(0)],
                            costBasis: [50000, Validators.min(0)],
                            adjustment: [0],
                            codes: ['Z'],
                            category: ['F'],
                            deferredGainOriginallyInvested: [30000],
                            recognizedGain: [20000],
                            isDeferredGainIncluded: [true]
                        })
                    ])
                }),
                // 🟢 Property Sales (Forms 4797, 6252)
                propertySalesSection: this.fb.group({
                    soldProperty: ['No', Validators.required],
                    businessUse: ['No'],
                    receivedFullPayment: ['No'],
                    multiYearPayments: ['No'],
                    hasUnrecaptured1231Losses: ['No'],
                    unrecaptured1231LossAmount: [4000],
                    installmentSalesDetails: this.fb.array([
                        this.fb.group({
                            propertyDescription: [''],
                            businessUse: ['No'],
                            wasMainHome: ['No'],
                            dateAcquired: ['2015-06-15'],
                            dateSold: ['2023-08-14'],
                            soldToRelatedParty: ['No'],
                            receivedFinalPaymentInTime: ['No'],
                            priceDeterminableByYearEnd: ['No'],
                            sellingPrice: [0],
                            buyerAssumedDebts: [0],
                            costOrBasis: [0],
                            depreciationAllowed: [0],
                            commissions: [0],
                            paymentsReceived: [0],
                            priorPaymentsReceived: [0],
                            relatedPartyName: ['N/A'],
                            relatedPartyStreet: ['N/A'],
                            relatedPartyCity: ['N/A'],
                            relatedPartyState: ['N/A'],
                            relatedPartyZip: ['00000'],
                            relatedPartyTIN: ['000-00-0000'],
                            relatedPartyDisposed: ['No'],
                            category: ['A'],
                            recaptureCode: [''],
                            soilWaterClearingExpenses: [0],
                            soilWaterDeductionYears: [''],
                            intangibleDrillingCosts: [0],
                            conditionA: [false],
                            conditionB: [false],
                            conditionC: [false],
                            conditionD: [false],
                            conditionE: [false],
                            line30: [0],
                            line31: [0],
                            line33: [0]
                        }),
                    ])
                }),
                // 🟢 Exchange Property (Form 8824)
                exchangePropertySection: this.fb.group({
                    likeKindExchange: ['No', Validators.required],
                    isSubjectTo1043: ['No'],
                    certificateNumber: ['2024-017'],
                    kindExchangeDetails: this.fb.array([
                        this.fb.group({
                            propertyGivenUp: [''],
                            fmvPrincipalGivenUp: [0],
                            adjustedBasisPrincipalGivenUp: [0],
                            propertyReceived: [''],
                            propertyGivenUpType: [''],
                            propertyReceivedType: [''],
                            fmvPrincipalReceived: [0],
                            dateAcquired: ['2022-01-01'],
                            dateGivenUp: ['2023-03-15'],
                            dateIdentified: ['2023-03-15'],
                            dateReceived: ['2023-03-20'],
                            businessUse: ['No'],
                            category: ['D'],
                            relatedPartyExchange: ['No'],
                            exceptionA: [false],
                            exceptionB: [false],
                            exceptionC: [false],
                            relatedPartyName: ['N/A'],
                            relatedPartyRelationship: ['N/A'],
                            relatedPartyIdNumber: ['000-00-0000'],
                            relatedPartyAddress: ['N/A'],
                            relatedPartySold: ['No'],
                            youSoldProperty: ['No'],
                            givenUpAdditionalProperty: ['No'],
                            additionalPropertyGivenDescription: [''],
                            fmvGivenUp: [0],
                            adjustedBasis: [0],
                            receivedAdditionalProperty: ['No'],
                            additionalPropertyReceivedDescription: ['Vehicle'],
                            additionalPropertyReceivedFMV: [0],
                            exchangeExpenses: [0],
                            wasDepreciated: ['No'],
                            line21OrdinaryIncome: [0],
                        }),
                    ]),
                    conflictSales: this.fb.array([
                        this.fb.group({
                            divestedPropertyDescription: ['Shares in government contractor firm'],
                            replacementPropertyDescription: ['Mutual fund tracking S&P 500'],
                            dateAcquired: ['2023-04-01'],
                            dateSold: ['2024-04-01'],
                            divestedSalePrice: [100000],
                            divestedBasis: [70000],
                            replacementCost: [105000],
                            ordinaryIncomeRecapture: [5000],
                            category: ['A']
                        }),
                        this.fb.group({
                            divestedPropertyDescription: ['Interest in private energy company'],
                            replacementPropertyDescription: ['U.S. Treasury Inflation-Protected Securities'],
                            dateAcquired: ['2023-04-01'],
                            dateSold: ['2024-06-10'],
                            divestedSalePrice: [85000],
                            divestedBasis: [60000],
                            replacementCost: [90000],
                            ordinaryIncomeRecapture: [2500],
                            category: ['E']
                        }),
                    ])
                }),
                // 🟢 Casualties and Thefts (Form 4684)
                casualtiesTheftsSection: this.fb.group({
                    hasCasualtiesThefts: ['No', Validators.required],
                    casualtiesDetails: this.fb.array([
                        this.fb.group({
                            propertyType: [''],
                            cityState: [''],
                            zipCode: [''],
                            dateAcquired: ['2020-05-15'],
                            costBasis: [0, Validators.min(0)],
                            insuranceReimbursement: [0, Validators.min(0)],
                            fairMarketValueBefore: [0, Validators.min(0)],
                            fairMarketValueAfter: [0, Validators.min(0)],
                            propertyUse: [''],
                            eventName: [''],
                            eventDate: ['2022-09-10'],
                            lossType: [''],
                            femaType: ['DR'],
                            femaNumber: ['FL-1234'],
                            applyLossToPriorYear: [false],
                            category: ['D']
                        }),
                    ])
                }),
                // 🟢 Casualties and Thefts (Form 4684)
                ponziSchemeSection: this.fb.group({
                    hasPonziLoss: ['No', Validators.required],
                    ponziLosses: this.fb.array([
                        this.fb.group({
                            responsibleName: ['Madoff Investments LLC'],
                            responsibleTIN: ['12-3456789'],
                            responsibleAddress: ['123 Wall Street, New York, NY 10005'],
                            initialInvestment: [100000, Validators.min(0)],
                            subsequentInvestments: [20000, Validators.min(0)],
                            reportedIncome: [15000, Validators.min(0)],
                            withdrawals: [5000, Validators.min(0)],
                            actualRecovery: [10000, Validators.min(0)],
                            sipcRecovery: [5000, Validators.min(0)],
                            thirdPartyRecovery: ['No']
                        })
                    ])
                }),
                form8829: this.fb.group({
                    usedHomeForBusiness: ['No', [Validators.required]],
                    // Parte I (Datos generales del negocio en casa)
                    businessArea: [200, Validators.min(0)],
                    totalArea: [2000, Validators.min(0)],
                    businessType: ['daycare'],
                    daycareDays: [250, Validators.min(0)],
                    hoursPerDay: [10, Validators.min(0)],
                    totalHomeArea: [4000, Validators.min(0)],
                    businessUseArea: [3500, Validators.min(0)],
                    operationChange: ['No'],
                    operationStartDate: ['2024-05-15'],
                    // Parte II (Cálculo de deducciones)
                    casualtyLossesDE: [1111, Validators.min(0)],
                    casualtyLossesIE: [2222, Validators.min(0)],
                    mortgageInterestDE: [3333, Validators.min(0)],
                    mortgageInterestIE: [4444, Validators.min(0)],
                    realEstateTaxesDE: [5555, Validators.min(0)],
                    realEstateTaxesIE: [6666, Validators.min(0)],
                    excessMortgageInterestDE: [7777, Validators.min(0)],
                    excessMortgageInterestIE: [8888, Validators.min(0)],
                    excessRealEstateTaxesDE: [9999, Validators.min(0)],
                    excessRealEstateTaxesIE: [9911, Validators.min(0)],
                    insuranceDE: [1500, Validators.min(0)],
                    insuranceIE: [1400, Validators.min(0)],
                    rentDE: [12000, Validators.min(0)],
                    rentIE: [11000, Validators.min(0)],
                    repairsDE: [500, Validators.min(0)],
                    repairsIE: [450, Validators.min(0)],
                    utilitiesDE: [3000, Validators.min(0)],
                    utilitiesIE: [2800, Validators.min(0)],
                    otherExpensesDE: [2000, Validators.min(0)],
                    otherExpensesIE: [1800, Validators.min(0)],
                    operatingExpenses: [8181, Validators.min(0)],
                    casualtyLossesDepreciation: [9191, Validators.min(0)],
                    excessCasualtyLosses: [7171, Validators.min(0)],
                    fairMarketValue: [9292, Validators.min(0)],
                    landValue: [6363, Validators.min(0)],
                }),
                scheduleDCarryover: this.fb.group({
                    hasShortTermCarryover: ['No', Validators.required],
                    shortTermCarryoverAmount: [1500, [Validators.min(0)]],
                    longTermCarryoverAmount: [3000, [Validators.min(0)]]
                }),
                rate28GainSection: this.fb.group({
                    had28RateGain: ['No', Validators.required],
                    rate28GainDetails: this.fb.array([
                        this.fb.group({
                            assetType: ['Collectible'],
                            description: ['Antique painting'],
                            acquisitionDate: ['2010-03-12'],
                            saleDate: ['2024-01-15'],
                            salePrice: [15000, Validators.min(0)],
                            costBasis: [4000, Validators.min(0)],
                            gainOrLoss: [11000]
                        }),
                        this.fb.group({
                            assetType: ['Section 1202 Stock'],
                            description: ['Qualified small business stock'],
                            acquisitionDate: ['2015-06-01'],
                            saleDate: ['2024-02-20'],
                            salePrice: [30000, Validators.min(0)],
                            costBasis: [10000, Validators.min(0)],
                            gainOrLoss: [20000]
                        })
                    ])
                }),
                investmentInterestSection: this.fb.group({
                    hadInvestmentInterest: ['No', Validators.required],
                    line1: [1200, [Validators.min(0)]],
                    line2: [500, [Validators.min(0)]],
                    line4a: [100, [Validators.min(0)]],
                    line4b: [200, [Validators.min(0)]],
                    line4d: [300, [Validators.min(0)]],
                    line5: [1100, [Validators.min(0)]],
                }),
                scheduleESection: this.fb.group({
                    hasScheduleE: ['No', Validators.required],
                    has1099Payments: ['No'],
                    willFile1099: ['No'],
                    isRealEstateProfessional: ['No'],
                    moreThan1000Hours: ['No'],
                    realEstateIncomeLoss: [0],
                    isRealEstateProperty: ['No'],
                    rentalProperties: this.fb.array([
                        this.fb.group({
                            address: [''],
                            propertyType: ['0'], // Single Family Residence
                            isPTP: [true],
                            fairRentalDays: [0],
                            personalUseDays: [0],
                            rentsReceived: [0],
                            royaltyReceived: [0],
                            qjv: [false],
                            advertising: [0],
                            autoTravel: [0],
                            cleaningMaintenance: [0],
                            commissions: [0],
                            insurance: [0],
                            legalFees: [0],
                            managementFees: [0],
                            mortgageInterest: [0],
                            otherInterest: [0],
                            repairs: [0],
                            supplies: [0],
                            taxes: [0],
                            utilities: [0],
                            depreciation: [0],
                            priorYearUnallowedCRD: [0],
                            otherExpenses: [0],
                            isAtRisk: ['No'],
                            adjustedBasisStartYear: [0],
                            yearIncreases: [0],
                            yearDecreases: [0],
                            investmentAtEffectiveDate: [0],
                            increasesAtEffectiveDate: [0],
                            decreasesAtEffectiveDate: [0],
                            priorYearLine19b: [0],
                            increasesSince: [0],
                            increasesSinceOption: [''],
                            decreasesSince: [0],
                            decreasesSinceOption: [''],
                        }),
                    ]),
                    isRoyalty: ['Yes', Validators.required],
                    royalties: this.fb.array([
                        this.fb.group({
                            address: ['Book Royalties'],           // <- renombrado desde 'source'
                            propertyType: ['6'],
                            royaltyReceived: [0],               // <- renombrado desde 'amount'
                            rentsReceived: [0],                    // <- agregado para compatibilidad
                            isPTP: [false],                        // <- agregado para tratar como nonPTP
                            isPassive: [false],
                            isAtRisk: [false],
                            taxYear: [2024],
                            advertising: [0],
                            autoTravel: [0],
                            cleaningMaintenance: [0],
                            commissions: [0],
                            insurance: [0],
                            legalFees: [0],                      // <- renombrado desde 'legalProfessionalFees'
                            managementFees: [0],
                            mortgageInterest: [0],
                            otherInterest: [0],
                            repairs: [0],
                            supplies: [0],
                            taxes: [0],
                            utilities: [0],
                            depreciation: [0],
                            otherExpenses: [0]
                        }),
                    ]),
                }),
                farmRentalWrapper: this.fb.group({
                    hasFarmRental: ['No'],
                    farmRentalSections: this.fb.array([
                        this.fb.group({
                            farmActivityName: [''],
                            farmActivityCode: [0],
                            einForm4835: [123456987],
                            activelyParticipate: ['No'],
                            accountingMethod: ['Cash'],
                            lineF1099Required: ['No'],
                            lineG1099Filed: ['No'],
                            investmentRisk: ['allRisk'],
                            // PART I
                            line1Income: [0],
                            line1bCost: [0],
                            line45InventoryBegin: [0],
                            line48InventoryEnd: [0],
                            line2SalesRaised: [0],
                            line2aCoopDist: [0],
                            line2bTaxable: [0],
                            line3aAgriPayments: [0],
                            line3bTaxable: [0],
                            line4aCCCReported: [0],
                            line4bCCCForfeited: [0],
                            line4cCCCTaxable: [0],
                            line5aCropInsurance: [0],
                            line5bTaxable: [0],
                            line5cElection: [true],
                            line5dDeferred: [0],
                            line6OtherIncome: [0],
                            line7CustomHire: [0],
                            //PART II
                            line8CarTruck: [0],
                            line9Chemicals: [0],
                            line10Conservation: [0],
                            line11CustomHire: [0],
                            line12Depreciation: [0],
                            line13EmployeeBenefits: [0],
                            line14Feed: [0],
                            line15Fertilizers: [0],
                            line16Freight: [0],
                            line17Fuel: [0],
                            line18Insurance: [0],
                            line19aMortgage: [0],
                            line19bOtherInterest: [0],
                            line20Labor: [0],
                            line21Pension: [0],
                            line22aRentVehicles: [0],
                            line22bRentOther: [0],
                            line23Repairs: [0],
                            line24Seeds: [0],
                            line25Storage: [0],
                            line26Supplies: [0],
                            line27Taxes: [0],
                            line28Utilities: [0],
                            line29Vet: [0],
                            priorYearLoss: [0],
                            priorYearUnallowedCRD: [0],
                            hasOtherExpenses: ['Yes'],
                            line30OtherExpenses: this.fb.array([
                                this.fb.group({ description: ['Office supplies'], amount: [0] }),
                                this.fb.group({ description: ['Small tools'], amount: [0] })
                            ])
                        })
                    ])
                }),
            }),

            // 🟢 SECCIÓN 4 - Employment and Self-Employment Income
            employmentInfo: this.fb.group({
                // 🟢 W-2
                w2Section: this.fb.group({
                    receivedW2: ['Yes', Validators.required],
                    w2Info: this.fb.array([
                        this.fb.group({
                            wages: [50000, Validators.min(0)], // 1040 - Line 1a
                            federalTaxWithheld: [5000, Validators.min(0)],
                            carryOverAmount: [5000, Validators.min(0)],
							employerEIN: ['000000007'],
                            employerName: ['ABC Corp'],
                            employerAddress: ['456 Elm St'],
                            employerCity: ['CINCINNATI'],
                            employerState: ['OH'],
                            employerZip: ['10001'],
                            controlNumber: ['CN12345'],

                            socialSecurityWages: [0, Validators.min(0)],
                            socialSecurityTaxWithheld: [0, Validators.min(0)],
                            medicareWages: [0, Validators.min(0)],
                            medicareTaxWithheld: [0, Validators.min(0)],
                            socialSecurityTips: [0, Validators.min(0)],
                            allocatedTips: [0, Validators.min(0)],

                            dependentCareBenefitsAmount: [0, Validators.min(0)],
                            unusedBenefits: [0, Validators.min(0)],

                            stateWages: [0, Validators.min(0)],
                            stateTaxWithheld: [0, Validators.min(0)],
                            WagesTips: [0, Validators.min(0)],
                            stateRealState: [0, Validators.min(0)],
                            personalPropertyTax: [0, Validators.min(0)],
                            localTaxWithheld: [0, Validators.min(0)],

                            localityName: [''],
                            taxType: [''],
                            taxAmount: [0, Validators.min(0)],
                        })
                    ])
                }),

                // 🟢 1099
                scheduleCSection: this.fb.group({
                    hasSelfEmployment: ['No', Validators.required],
                    scheduleCInfo: this.fb.array([
                        this.fb.group({
                            businessName: [''],
                            businessCode: [''],
                            employerEIN: [''],
                            businessAddress: [''],
                            businessCity: [''],
                            businessState: [''],
                            businessZip: [''],
                            businessDescription: [''],
                            // ----------- INCOME INFO -----------
                            grossIncome: [],
                            expenses: [],
                            netProfit: [],
                            grossReceipts: [],
                            returnsAllowances: [],
                            otherIncome: [],
                            statutoryEmployee: [false],
                            federalTaxWithheld: [],
                            // ----------- SETTINGS -----------
                            accountingMethod: [''],
                            materialParticipation: [''],
                            madePayments: [''],
                            requiredForm1099: [''],
                            contributedToQualifiedPlan: [''],
                            qualifiedPlanContributionAmount: [],
                            paidHealthInsuranceAsSelfEmployed: [''],
                            healthInsuranceAmount: [],
                            hadEarlyWithdrawalPenalty: [''],
                            earlyWithdrawalPenaltyAmount: [],
                            investmentRisk: [''],
                            newBusiness: [false],
                            // ----------- INVENTORY QUESTIONS -----------
                            inventoryMethod: [''],
                            inventoryChange: [''],
                            // ----------- EXPENSES (ALL) -----------
                            advertising: [],
                            carTruckExpenses: [],
                            commissionsFees: [],
                            contractLabor: [],
                            depletion: [],
                            depreciation: [],
                            employeeBenefits: [],
                            insurance: [],
                            mortgageInterest: [],
                            otherInterest: [],
                            legalProfessionalServices: [],
                            officeExpense: [],
                            pensionPlans: [],
                            rentVehicles: [],
                            rentOtherProperty: [],
                            repairsMaintenance: [],
                            supplies: [],
                            taxesLicenses: [],
                            travelExpenses: [],
                            mealsDeductible: [],
                            utilities: [],
                            wages: [],
                            energyEfficientDeduction: [],
                            // ----------- COGS (COST OF GOODS SOLD) -----------
                            inventoryBeginning: [],
                            purchases: [],
                            costLabor: [],
                            materialsSupplies: [],
                            otherCosts: [],
                            inventoryEnding: [],
                            // ----------- Other Expenses -----------
                            otherExpensesDescription1: [''],
                            otherExpensesAmount1: [],
                            otherExpensesDescription2: [''],
                            otherExpensesAmount2: [],
                            otherExpensesDescription3: [''],
                            otherExpensesAmount3: [],
                            otherExpensesDescription4: [''],
                            otherExpensesAmount4: [],
                            totalOtherExpenses: [],
                        })
                    ]),
                }),

                // 🟢 k-1
                BusinessOwnerSection: this.fb.group({
                    isPartnershipAndCorporation: ['No', Validators.required],
                    k1Entities: this.fb.array([
                        this.fb.group({
                            entityName: ['Sunrise Real Estate LLC'],   // (a)
                            entityType: ['P'],                          // (b) P = Partnership
                            isForeign: ['false'],                       // (c)
                            ein: ['12-3456789'],                        // (d)
                            requiresBasisComputation: ['true'],         // (e)
                            anyNotAtRisk: ['false'],                    // (f)
                            passiveLossAllowed: [0],                 // (g)
                            passiveIncome: [0],                      // (h)
                            nonPassiveLossAllowed: [0],                 // (i)
                            section179Expense: [0],                     // (j)
                            nonPassiveIncome: [0],                      // (k)
                        }),
                    ]),
                    hasRemicIncome: ['No', Validators.required],
                    remicSection: this.fb.array([
                        this.fb.group({
                            name: ['Real Estate Trust Fund A'],
                            ein: ['12-3456789'],
                            excessInclusion: [0],
                            taxableIncome: [0],
                            otherIncome: [0]
                        }),
                    ]),
                    hasExcessDeduction67e: ['Yes'],
                    excessDeduction67eAmount: ['0']
                }),

                BenefitsAndTrustSection: this.fb.group({
                    isEstatesAndTrusts: ['No', Validators.required],
                    estatesAndTrusts: this.fb.array([
                        this.fb.group({
                            name: ['Estate of John Doe'], // (a)
                            ein: ['11-1111111'],          // (b)
                            passiveDeductionAllowed: [1000], // (c)
                            passiveIncome: [1500],           // (d)
                            nonPassiveLoss: [0],             // (e)
                            otherNonPassiveIncome: [800]     // (f)
                        }),
                        this.fb.group({
                            name: ['Trust of Jane Smith'],
                            ein: ['22-2222222'],
                            passiveDeductionAllowed: [0],
                            passiveIncome: [0],
                            nonPassiveLoss: [300],
                            otherNonPassiveIncome: [1200]
                        })
                    ]),
                }),

                // 1099-C Cancellation of Debt
                cancellationOfDebtSection: this.fb.group({
                    received1099C: ['No', Validators.required],   // Sí/No
                    debtEntries: this.fb.array([
                        this.fb.group({
                            creditorName: ['Bank of America'],
                            creditorTIN: ['12-3456789'],
                            creditorAddress: ['123 Main St, New York, NY'],
                            dateCancelled: ['2024-07-01'],       // Box 1
                            amountCancelled: [0],             // Box 2
                            descriptionOfDebt: ['Credit Card'],  // Box 4
                            reason: ['Bankruptcy'],              // Box 6
                            propertyFairMarketValue: [0]         // Box 7 (si aplica, hipoteca)
                        })
                    ])
                }),

                //1099-G
                unemploymentSection: this.fb.group({
                    unemploymentAmount: [0],
                    unemploymentTaxWithheld: [0],
                    stateName: ['FL'],
                    stateTaxWithheld: [0]
                }),

                // 2555
                foreignEarnedIncomeSection: this.fb.group({
                    hasForeignIncome: ['No', Validators.required],
                    yourForeignAddress: ['123 Calle Mayor, Madrid, Spain'],
                    yourForeignOccupation: ['Software Engineer'],
                    employerName: ['Tech Solutions SL'],
                    employerUSAddress: ['100 Main St, Miami, FL, USA'],
                    employerForeignAddress: ['456 Gran Vía, Madrid, Spain'],
                    totalForeignIncome: [45000, [Validators.min(0)]],
                    employerType: ['AForeignEntity'],
                    qualificationTest: ['PhysicalPresence'],
                    filedForm2555: ['Yes'],
                    lastYearFiled: ['2021'],
                    everRevokedExclusions: ['No'],
                    revocationDetails: [''],
                    countryYouAreCitizen: ['Spain'],
                    employmentContractTerms: ['2-year renewable contract'],
                    foreignVisaType: ['Work Visa'],
                    maintainedSeparateResidence: ['No'],
                    separateResidenceLocation: [''],
                    separateResidenceDays: [0],
                    livedFullYearWithoutBreaks: ['No'],
                    bonaFideResidenceStart: ['2023-01-01'],
                    bonaFideResidenceEnd: [''],
                    foreignLivingQuarters: ['RentedHouseApartment'],
                    familyLivedAbroad: ['Yes'],
                    nameFamilyLivedAbroad: ['Spouse'],
                    submittedNonResidentStatement: ['No'],
                    requiredToPayForeignTax: ['Yes'],
                    usPresenceRecords: this.fb.array([
                        this.fb.group({
                            dateArrived: ['2024-03-10'],
                            dateLeft: ['2024-03-15'],
                            daysOnBusiness: [5],
                            incomeEarnedUS: [800]
                        })
                    ]),
                    visaLimitedStay: ['No'],
                    maintainedHomeInUS: ['No'],
                    usHomeDetails: [''],
                    physicalPresenceStart: ['2024-01-01'],
                    physicalPresenceEnd: ['2024-12-31'],
                    principalEmploymentCountry: ['Spain'],
                    foreignTravelRecords: this.fb.array([
                        this.fb.group({
                            countryName: ['Spain'],
                            dateArrived: ['2024-01-10'],
                            dateLeft: ['2024-02-15'],
                            fullDaysInCountry: [36],
                            daysInUSOnBusiness: [0],
                            incomeEarnedUS: [0]
                        })
                    ]),
                    // Part IV
                    totalWagesSalaries: [42000, [Validators.min(0)]],
                    businessIncome: [3000, [Validators.min(0)]],
                    partnershipNameAddress: ['Global Partners, London'],
                    partnershipIncome: [0, [Validators.min(0)]],
                    noncashHome: [1200, [Validators.min(0)]],
                    noncashMeals: [800, [Validators.min(0)]],
                    noncashCar: [500, [Validators.min(0)]],
                    noncashOtherDesc: ['Work tools provided by employer'],
                    noncashOther: [300, [Validators.min(0)]],
                    allowanceCostOfLiving: [2000, [Validators.min(0)]],
                    allowanceFamily: [0, [Validators.min(0)]],
                    allowanceEducation: [0, [Validators.min(0)]],
                    allowanceHomeLeave: [500, [Validators.min(0)]],
                    allowanceQuarters: [0, [Validators.min(0)]],
                    allowanceOtherDesc: ['Travel stipend'],
                    allowanceOther: [250, [Validators.min(0)]],
                    otherForeignIncomeDesc: ['Freelance project'],
                    otherForeignIncome: [1000, [Validators.min(0)]],
                    excludedMealsLodging: [800, [Validators.min(0)]],
                    //Part V
                    claimHousingExclusion: ['No', Validators.required],
                    //Part VI
                    qualifiedHousingExpenses: [18000, [Validators.min(0)]],
                    housingLocation: ['Madrid, Spain'],
                    housingLimit: [20240, [Validators.min(0)]],
                    qualifyingDays: [365, [Validators.min(0)]],
                    employerProvidedHousing: [3000, [Validators.min(0)]],
                    //Part VIII
                    deductionsAllocable: [987987, [Validators.min(0)]],

                }),

                // Social Security Section (SSA-1099)
                socialSecuritySection: this.fb.group({
                    receivedSSA1099: ['No'],
                    lumpSumElection: ['No'],
                    socialSecurityBenefits: ['0'], //1040 - 6a
                    socialSecurityTaxableAmount: ['0'], //1040 - 6b
                }),

                form8919: this.fb.group({
                    hasMisclassification: ['No', Validators.required],
                    workedForFirm: [false],
                    received1099: [false],
                    noTaxWithheld: [false],
                    shouldBeEmployee: [false],
                    reasonCode: [''],
                    ss8SentConfirmation1: [false],
                    firms: this.fb.array([
                        this.fb.group({
                            firmName: [''],
                            firmEIN: [''],
                            reasonCode: [''],
                            irsDate: [''],
                            received1099Checkbox: [false],
                            wagesAmount: []
                        })
                    ])
                }),

                form8919Spouse: this.fb.group({
                    hasSpouseMisclassification: ['No', Validators.required],
                    workedForFirm: [false],
                    received1099: [false],
                    noTaxWithheld: [false],
                    shouldBeEmployee: [false],
                    reasonCode: [''],
                    ss8SentConfirmation1: [false],
                    firms: this.fb.array([
                        this.fb.group({
                            firmName: [''],
                            firmEIN: [''],
                            reasonCode: [''],
                            irsDate: [''],
                            received1099Checkbox: [false],
                            wagesAmount: []
                        })
                    ])
                }),

                // 🟢 Income, Tax and Payments (condensado)
                incomeTaxPaymentsSection: this.fb.group({
                    // Other Types of Income
                    tipIncomeNotReported: ['0'], //1040 - 1c
                    medicaidWaiverPayments: ['0'], //1040 - 1d
                    otherEarnedIncome: ['0'], //1040 - 1h
                    nontaxableCombatPay: ['0'], //1040 - 1i
                    taxExemptInterest: ['0'], //1040 - 2a
                    taxableInterest: ['0'], //1040 - 2b
                    qualifiedDividends: ['0'], //1040 - 3a
                    ordinaryDividends: ['0'], //1040 - 3b
                    iraDistributionsTotal: ['0'], //1040 - 4a
                    iraTaxableAmount: ['0'], //1040 - 4b
                    pensionsAndAnnuities: ['0'], //1040 - 5a
                    pensionsTaxableAmount: ['0'], //1040 - 5b
                    householdEmployeeWages: ['0'], //1040 - 1b
                    personalItemsLoss1099k: ['0', Validators.min(0)], //Schedule1 - 0

                    // Tax Credits and Deductions
                    childTaxCredit: ['0'],
                    earnedIncomeCredit: ['0'],

                    // Payments Made
                    estimatedTaxPayments: ['0'],
                    federalTaxWithheldOther: ['0'],
                }),

                scheduleK1ShortTerm: this.fb.group({
                    receivedK1ShortTerm: ['No', Validators.required],
                    k1ShortTermEntries: this.fb.array([
                        this.fb.group({
                            k1EntityName: ['Beta Capital LP'],
                            k1IncomeAmount: [4350.25, Validators.min(0)],
                            k1Notes: ['Short-term gain from trading activity']
                        }),
                        this.fb.group({
                            k1EntityName: ['Northbridge Holdings'],
                            k1IncomeAmount: [0, Validators.min(0)],
                            k1Notes: ['Short-term passive loss']
                        })
                    ])
                }),

                scheduleK1LongTerm: this.fb.group({
                    receivedK1LongTerm: ['No', Validators.required],
                    k1LongTermEntries: this.fb.array([
                        this.fb.group({
                            k1EntityName: ['Evergreen Investments'],
                            k1IncomeAmount: [12750.00, Validators.min(0)],
                            k1Notes: ['Long-term capital gain distribution']
                        }),
                        this.fb.group({
                            k1EntityName: ['Oak Tree Partners'],
                            k1IncomeAmount: [2650.50, Validators.min(0)],
                            k1Notes: ['Real estate long-term gain']
                        }),
                        this.fb.group({
                            k1EntityName: ['Cedar Trust'],
                            k1IncomeAmount: [0, Validators.min(0)],
                            k1Notes: ['Long-term capital loss carryover']
                        })
                    ])
                }),

                gamblingIncomeSection: this.fb.group({
                    receivedGamblingIncome: ['No'],  // Para probarlo en activo
                    gamblingEntries: this.fb.array([
                        this.fb.group({
                            payerName: [''],
                            payerEIN: [''],
                            payerAddress: [''],
                            dateWon: [''],
                            amountWon: [0],
                            federalWithheld: [0],
                            stateWithheld: [0],
                            // extras opcionales si quieres el espejo del W-2G:
                            typeOfWager: [''],
                            localityName: [''],
                            localWithheld: [0],
                            stateWinnings: [0]
                        })
                    ])
                }),

                religiousIncomeInfo: this.fb.group({
                    ministerEarningsCheckbox: ['No'],
                    chaplain403bContribution: ['No'],
                    chaplain403bAmount: ['0'],
                }),
            }),

            // 🟢 SECCIÓN 5 - DEDUCTIONS AND ADJUSTMENTS
            deductionsAndAdjustments: this.fb.group({
                claimedAsDependent: [false],
                spouseClaimedAsDependent: [false],
                spouseItemizes: [false],
                dualStatusAlien: [false],

                otherIncomes: this.fb.group({
                    receivedStateRefund: ['No'],
                    stateRefundAmount: [0],

                    repaidTradeActBenefits: ['No'],
                    tradeActRepaymentAmount: [0],

                    receivedOrPaidAlimony: ['No'],
                    divorceAgreementDate: ['2024-05-22'],
                    receivedAlimony: ['No'],
                    alimonyReceived: [0],
                    paidAlimony: ['No'],
                    alimonyPaid: [0],
                    recipientSSN: [9876543221],

                    receivedAlaskaFund: ['No'],
                    alaskaFundAmount: [0],

                    contributedTo501c18Plan: ['No'],
                    contributionAmount501c18Plan: [0],

                    receivedJuryDutyPay: ['No'],
                    juryDutyPayAmount: [0],
                    returnedJuryDutyPay: ['No'],
                    juryDutyPayReturned: [0],

                    receivedPrizesAwards: ['No'],
                    prizesAwardsAmount: [0],

                    receivedNotForProfitIncome: ['No'],
                    notForProfitIncomeAmount: [0],

                    receivedStockOptions: ['No'],
                    stockOptionsAmount: [0],

                    receivedRentalPersonalProperty: ['No'],
                    rentalPersonalPropertyAmount: [0],
                    rentalPersonalPropertyExpenses: [0],

                    receivedOlympicPrize: ['No'],
                    olympicPrizeAmount: [0],
                    olympicPrizeBelowThreshold: ['No'],

                    ownsForeignEntities: ['No'],
                    section951aIncome: [0],
                    section951AaIncome: [0],

                    hasExcessBusinessLoss: ['No'],
                    excessBusinessLossAmount: [0],

                    receivedAbleDistribution: ['No'],
                    ableDistributionAmount: [0],

                    hadReforestationExpenses: ['No'],
                    reforestationAmount: [0],

                    receivedScholarshipGrant: ['No'],
                    scholarshipGrantAmount: [0],

                    receivedNonqualifiedPension: ['No'],
                    nonqualifiedPensionAmount: [0],

                    earnedWhileIncarcerated: ['No'],
                    incarceratedWagesAmount: [0],

                    receivedDigitalAssetsIncome: ['No'],
                    digitalAssetsIncomeAmount: [0],

                    hasOtherIncomeZ: ['No'],
                    otherIncomeZList: this.fb.array([
                        this.fb.group({
                            incomeType: [''],
                            incomeAmount: [0]
                        }),
                        this.fb.group({
                            incomeType: [''],
                            incomeAmount: [0]
                        }),
                        this.fb.group({
                            incomeType: [''],
                            incomeAmount: [0]
                        })
                    ]),

                    hasNetOperatingLoss: ['No'],
                    netOperatingLossAmount: ['0'],

                    isEducator: ['No'],
                    educatorExpensesAmount: ['0'],

                    discriminationLegalFeesPaid: ['No'],
                    discriminationLegalFeesAmount: ['0'],

                    irsWhistleblowerLegalFeesPaid: ['No'],
                    irsWhistleblowerLegalFeesAmount: ['0'],

                    hasOtherAdjustmentsZ: ['No'],
                    otherAdjustmentsZList: this.fb.array([
                        this.fb.group({
                            adjustmentType: [''],
                            adjustmentAmount: [0]
                        }),
                    ]),
                }),

                form8853: this.fb.group({
                    hasArcherOrLtc: ['No'],
                    hasArcherMSA: ['No'],
                    hasMedicareMSA: ['No'],
                    hasLtcInsurance: ['No'],
                    isQualifiedLtc: ['No'],
                    //ArcherMsaSection
                    employerContributions: [0],
                    employeeContributions: [0],
                    earnedCompensation: [0],
                    hdhpCoverageRecords: this.fb.array([
                        this.fb.group({
                            coverageType: [''],
                            monthsCovered: [0]
                        }),
                    ]),
                    totalDistributions: [0],
                    rolledOverAmount: [0],
                    qualifiedMedicalExpenses: [0],
                    hasException: ['No'],
                    //MedicareMsaSection
                    totalDistributionsMedicare: [0],
                    qualifiedMedicareExpenses: [0],
                    hasMedicareException: ['No'],
                    //Long-Term Care (LTC)
                    insuredName: [''],
                    insuredSSN: [''],
                    otherReceived: ['No'],
                    terminallyIll: ['No'],
                    grossLtcPayments: [0],
                    qualifiedLtcPortion: [0],
                    acceleratedBenefits: [0],
                    ltcServiceCosts: [0],
                    ltcReimbursements: [0],
                    ltcDays: [0]
                }),

                form8889: this.fb.group({
                    hasHSA: ['No'],
                    coverageType: [''],
                    totalContributions: [0],
                    employerContributions: [0],
                    hasSpouseHSA: ['No'],
                    spouseHSAShare: [0],
                    hasQualifiedFundingDistribution: ['No'],
                    qualifiedFundingAmount: [0],
                    distributionsReceived: [0],
                    rolloverOrWithdrawnExcess: [0],
                    qualifiedDistributions: [0],
                    hasExceptionToAdditionalTax: ['No'],
                    lastMonthRuleIncome: [0],
                    qualifiedFundingIncome: [0],
                }),

                movingExpensesSection: this.fb.group({
                    isArmedForcesMember: ['No', Validators.required],
                    transportationAndStorage: [0],
                    travelAndLodging: [0],
                    employerReimbursement: [0]
                }),
            }),

            // 🟢 SECCIÓN 6 - DEDUCTIONS AND CREDITS
            deductionsCreditsSection: this.fb.group({

                premiumTaxCreditSection: this.fb.group({
                    received1095A: ['Yes', [Validators.required]],
                    taxFamilySize: [1, Validators.min(1)],
                    sharedPolicyWithAnotherTaxpayer: ['No', Validators.required],
                    marketplaceMonths: this.fb.array(
                        this.getMarketplaceMonths()
                    )
                }),

                scheduleA: this.fb.group({
                    hadMedicalExpenses: ['Yes', [Validators.required]],
                    totalMedicalExpenses: [111, Validators.min(0)],
                }),

                deductionsSummary: this.fb.group({
                    usedForHomeImprovement: ['No', Validators.required],
                    mortgageInterest1098: ['0'],
                    mortgageInterestNot1098: ['0'],
                    pointsNotReported: ['0'],
                    investmentInterest: ['0'],
                    totalInterestPaid: ['0'],
                    recipientName: [''],
                    recipientId: ['0'],
                    recipientAddress: [''],
                    cashGifts: ['0'],
                    nonCashGifts: ['0'],
                    carryoverFromPriorYear: ['0'],
                }),

                form2106: this.fb.group({
                    hasJobExpenses: ['No', Validators.required],
                    occupationWhichIncurred: [''],
                    vehicleExpense: ['0'],
                    parkingFees: ['0'],
                    travelExpense: ['0'],
                    businessExpense: ['0'],
                    mealExpense: ['0'],
                    totalExpenses: ['0'],

                    // Sección de Vehículos
                    vehicle1Date: [''],
                    vehicle1Miles: ['0'],
                    vehicle1BusinessMiles: ['0'],
                    vehicle1CommutingMiles: ['0'],
                    vehicle1Evidence: ['No'],

                    vehicle2Date: ['2024-02-01'],
                    vehicle2Miles: ['0'],
                    vehicle2BusinessMiles: ['0'],
                    vehicle2CommutingMiles: ['0'],
                    vehicle2Evidence: ['No'],

                    // Preguntas de uso del vehículo
                    vehiclePersonalUse: ['No'],
                    anotherVehicleAvailable: ['No'],
                    evidenceSupportDeduction: ['No'],
                    writtenEvidence: ['No'],

                    // 🔹 Sección C - Gastos Reales
                    vehicle1gasOilRepairs: ['0'],
                    vehicle1vehicleRentals: ['0'],
                    vehicle1employerProvidedVehicle: ['0'],
                    vehicle1Depreciation: ['0'],

                    vehicle2gasOilRepairs: ['0'],
                    vehicle2vehicleRentals: ['0'],
                    vehicle2employerProvidedVehicle: ['0'],
                    vehicle2Depreciation: ['0'],

                    // 🔹 Sección D - Depreciación de Vehículos
                    vehicle1Cost: ['0'],
                    vehicle1Section179: ['0'],
                    vehicle1DepreciationMethod: ['0'],

                    vehicle2Cost: ['0'],
                    vehicle2Section179: ['0'],
                    vehicle2DepreciationMethod: ['0'],
                }),
            }),

            // 🟢 SECCIÓN 7 - FINAL REVIEW AND AUTHORIZATION
            specialSituations: this.fb.group({

                adoptionCreditForm: this.fb.group({
                    qualifiedAdoptionExpenses: ['No', Validators.required],
                    paidAdoptionExpenses2023: [false],
                    paidAdoptionExpenses2024: [false],
                    adoptedSpecialNeedsChild: [false],
                    adoptedChildren: this.fb.array([
                        this.fb.group({
                            firstName: [''],
                            lastName: [''],
                            yearOfBirth: ['', [Validators.minLength(4), Validators.maxLength(4)]],
                            bornBefore2007AndDisabled: [false],
                            specialNeeds: [false],
                            foreignChild: [false],
                            childIdNumber: [''],
                            adoptionFinalized2024: [false]
                        })
                    ]),
                    maxAdoptionCreditChild1: [0],
                    maxAdoptionCreditChild2: [0],
                    maxAdoptionCreditChild3: [0],
                    filedForm8839: ['No'],
                    filedForm8839Child1: [0],
                    filedForm8839Child2: [0],
                    filedForm8839Child3: [0],
                    qualifiedExpensesChild1: ['0'],
                    qualifiedExpensesChild2: ['0'],
                    qualifiedExpensesChild3: ['0'],
                    modifiedAGI1: ['0'],
                    creditCarryforward: ['0'],
                    employerProvidedAdoptionBenefits: ['No'],
                    maxExclusionChild1: [0],
                    maxExclusionChild2: [0],
                    maxExclusionChild3: [0],
                    receivedPriorBenefit: ['No'],
                    receivedPriorBenefitChild1: [0],
                    receivedPriorBenefitChild2: [0],
                    receivedPriorBenefitChild3: [0],
                    benefitsReceivedChild1: [0],
                    benefitsReceivedChild2: [0],
                    benefitsReceivedChild3: [0],
                    modifiedAGI2: ['0'],
                }),
            }),

            // 🟢 SECCIÓN 8 - FINAL REVIEW AND AUTHORIZATION
            refundSection: this.fb.group({
                form8880: this.fb.group({
                    madeRetirementContributions: ['No'],
                    yourTraditionalIRA: [0, [Validators.min(0)]],
                    yourRothIRA: [0, [Validators.min(0)]],
                    yourABLE: [0, [Validators.min(0)]],
                    spouseTraditionalIRA: [0, [Validators.min(0)]],
                    spouseRothIRA: [0, [Validators.min(0)]],
                    spouseABLE: [0, [Validators.min(0)]],
                    yourElectiveDeferrals: [0, [Validators.min(0)]],
                    spouseElectiveDeferrals: [0, [Validators.min(0)]],
                    yourDistributions: [0, [Validators.min(0)]],
                    spouseDistributions: [0, [Validators.min(0)]],
                }),

                form8862: this.fb.group({
                    needsEITCReinstatement: ['No'],
                }),

                // 🟢 REFUND
                refund: this.fb.group({
                    refundRequestedAmount: ['0'],
                    directDepositRoutingNumber: ['021000021', [Validators.minLength(9), Validators.maxLength(9)]],
                    directDepositAccountNumber: ['123456789012', [Validators.minLength(8), Validators.maxLength(12)]],
                    directDepositAccountType: ['Checking'],
                    estimatedTaxApplied: ['0'],
                }),
            }),

            // 🟢 SECCIÓN 9 - FINAL REVIEW AND AUTHORIZATION
            finalReviewSection: this.fb.group({
                // 🟢 Third Party
                thirdPartySection: this.fb.group({
                    thirdPartyDesignee: ['No'], // Yes/No option
                    designeeName: ['AAAA BBBB'], // Name field
                    designeePhone: ['3053057878', Validators.pattern(/^\d{10}$/)], // Phone number (10 digits)
                    designeePin: ['1234', [Validators.minLength(4), Validators.maxLength(8)]], // PIN (4-8 digits)
                }),
                // 🟢 Electronic Signature
                signatureSection: this.fb.group({
                    hasIpPin: ['No'],
                    yourPin: ['', Validators.pattern(/^\d{6}$/)],
                    spouseHasIpPin: ['No'],
                    spousePin: ['', Validators.pattern(/^\d{6}$/)],
                    authorizePin: [true],
                    authorizeSpousePin: [false]
                }),
                // 🟢 Refund Transfer (Pay fees from refund)
                refundTransfer: this.fb.group({
                    payFeesFromRefund: ['No'] // Yes/No radio
                }),
                // 🟢 Paid Preparer
                preparer: this.fb.group({
                    preparerName: ['Jane Smith'],
                    preparerSignature: ['Jane Smith'],
                    preparerDate: ['2025-01-15'],
                    ptin: ['12345678'],
                    firmName: ['Tax Prep Co.'],
                    firmAddress: ['456 Elm St, New York, NY'],
                    firmPhone: ['123-456-7891'],
                    firmEIN: ['12-3456789'],
                    selfEmployed: [true],
                }),
            }),
        });
    }

    // Create the business form
    private createBusinessForm(): FormGroup {
        return this.fb.group({
            // Business Information
            businessName: ['', Validators.required],
            businessTaxId: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
            businessAddress: ['', Validators.required],
            businessCity: ['', Validators.required],
            businessState: ['', Validators.required],
            businessZipCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],

            // Income Section
            businessIncome: this.fb.group({
                grossReceipts: ['0', Validators.required],
                costOfGoodsSold: ['0', Validators.required],
                netIncome: ['0', Validators.required],
            }),

            // Tax Information
            businessTax: this.fb.group({
                totalTax: ['0', Validators.required],
                credits: ['0', Validators.required],
            }),

            // Payments
            businessPayments: this.fb.group({
                totalPayments: ['0', Validators.required],
            }),

            // Refund or Amount Owed
            refundOrAmountOwe: this.fb.group({
                refundAmount: ['0', Validators.required],
                amountOwed: ['0', Validators.required],
            }),
        });
    }

    submitForm(): void {

        // (opcional) validación
        /*
        if (!this.taxForm.valid) {
            NeuralSwal.fire({
            icon: 'warning',
            title: 'Invalid form',
            text: 'Please complete all required fields before submitting.'
            });
            return;
        }
        */

        const payload = {
            ...this.taxForm.value,
            selectedDeclarationType: this.selectedDeclarationType,
            selectedDeclarationTypes: Array.from(this.selectedIncomeTypes)
        };

        // LOADING
        NeuralSwal.fire({
            title: 'Submitting tax return...',
            text: 'Please wait while we generate your PDF.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                NeuralSwal.showLoading();
            }
        });

        this.fillFormService.sendTaxDeclaration(payload).subscribe({

            // SUCCESS
            next: (httpResp: Blob) => {
                NeuralSwal.close();

                if (!httpResp || httpResp.size === 0) {
                    throw new Error('PDF not returned from backend');
                }

                console.log('[PDF] Blob size:', httpResp.size);

                // ✅ Descargar PDF directamente
                const url = window.URL.createObjectURL(httpResp);
                const a = document.createElement('a');
                a.href = url;
                a.download = '2025_Income_Tax_Return.pdf';
                document.body.appendChild(a);
                a.click();

                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 100);

                NeuralSwal.fire({
                    icon: 'success',
                    title: 'PDF generated successfully'
                });
            },

            // ❌ ERROR
            error: (err) => {
                NeuralSwal.close();
                console.error('[submitForm] Error:', err);
                this.handleBackendError(err);
            }
        });
    }

    private base64ToBlob(base64: string, contentType = 'application/pdf'): Blob {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    }

    private handleBackendError(error: any): void {

        console.error('[handleBackendError] Raw error:', error.error.message);

        // 🟢 CASO 1: Error de negocio desde el backend (DTO)
        if (error?.hasErrors === true) {

            const messages: string[] = [];

            if (Array.isArray(error.errors) && error.errors.length > 0) {
                messages.push(...error.errors);
            }

            if (error.irsMessage) {
                messages.push(error.irsMessage);
            }

            if (messages.length === 0) {
                messages.push('An unknown IRS processing error occurred.');
            }

            NeuralSwal.fire({
                icon: 'error',
                title: 'IRS Submission Failed',
                html: `
                <div style="text-align:left">
                <ul>
                    ${messages.map(m => `<li>${m}</li>`).join('')}
                </ul>
                </div>
            `,
                confirmButtonText: 'OK'
            });

            return;
        }

        // 🟡 CASO 2: Error legacy por code/message
        const code: string = error?.code ?? 'UNKNOWN_ERROR';
        const message: string =
            error?.error?.message ?? 'An unexpected error occurred. Please try again.';

        switch (code) {

            case 'UNAUTHENTICATED':
                NeuralSwal.fire({
                    icon: 'warning',
                    title: 'Session expired',
                    text: 'Please log in again to continue.',
                    confirmButtonText: 'Login'
                });
                break;

            case 'CUSTOMER_NOT_FOUND':
                NeuralSwal.fire({
                    icon: 'error',
                    title: 'Account not found',
                    text: 'Your customer account could not be located.'
                });
                break;

            case 'DUPLICATE_TAX_RETURN':
                NeuralSwal.fire({
                    icon: 'warning',
                    title: 'Duplicate tax return',
                    text: 'A tax return for this year already exists.'
                });
                break;

            case 'PDF_MERGE_FAILED':
            case 'PDF_GENERATION_FAILED':
                NeuralSwal.fire({
                    icon: 'error',
                    title: 'PDF generation failed',
                    text: 'We were unable to generate your tax return PDF. Please try again.'
                });
                break;

            case 'IO_ERROR':
                NeuralSwal.fire({
                    icon: 'error',
                    title: 'File processing error',
                    text: 'An error occurred while processing files.'
                });
                break;

            case 'DATABASE_ERROR':
                NeuralSwal.fire({
                    icon: 'error',
                    title: 'System error',
                    text: 'A database error occurred. Please try again later.'
                });
                break;

            // 🔴 CASO 3: Fallback final
            default:
                NeuralSwal.fire({
                    icon: 'error',
                    title: 'Unexpected error',
                    text: message
                });
        }
    }

    onFilingStatusChange(status: string): void {
        if (status === 'Married Filing Jointly') {
            if (!this.taxForm.contains('spouse')) {
                this.taxForm.addControl('spouse', this.fb.group({
                    spouseFAndMName: ['AAAA', Validators.required],
                    spouseLastName: ['BBBB', Validators.required],
                    spouseSsn: ['8889994512', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
                    spouseDob: ['1982-07-20', Validators.required],
                    spouseBlind: [false],
                    spouseGrossIncome: ['', Validators.required],
                    spouseRetirementPlan: [false, Validators.required]
                }));
            }
        } else {
            if (this.taxForm.contains('spouse')) {
                this.taxForm.removeControl('spouse');
            }
        }
    }

    get isStudentOrDisabled(): boolean {
        return this.taxForm.get('personalInfo.dependentSection.studentOrDisabled')?.value === 'Yes';
    }

    get dependents(): FormArray {
        return this.taxForm.get('personalInfo.dependentSection.dependents') as FormArray;
    }

    addDependent(): void {
        this.dependents.push(this.fb.group({
            firstName: [''],
            lastName: [''],
            ssn: ['', [Validators.minLength(9), Validators.maxLength(9)]],
            relationship: [''],
            childTaxCredit: [false],
            creditForOtherDependents: [false],
            livedWithYouMoreThanHalf: [false],
            livedInUS: [false],
            fullTimeStudent: [false],
            permanentlyDisabled: [false],
            under13OrDisabled: [false],
            qualifiedExpenses: []
        }));
    }

    removeDependent(index: number): void {
        const dependents = this.taxForm.get('personalInfo.dependentSection.dependents') as FormArray;
        dependents.removeAt(index);
    }

    get adoptedChildren(): FormArray {
        return this.taxForm.get('specialSituations.adoptionCreditForm.adoptedChildren') as FormArray;
    }

    addAdoptedChild(): void {
        this.adoptedChildren.push(this.fb.group({
            firstName: ['Johnn', Validators.required],
            lastName: ['Doee', Validators.required],
            yearOfBirth: ['2019', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
            bornBefore2007AndDisabled: [true],
            specialNeeds: [true],
            foreignChild: [true],
            childIdNumber: ['123456799', Validators.required],
            adoptionFinalized2024: [true]
        }));
    }

    removeAdoptedChild(index: number): void {
        const dependents = this.taxForm.get('specialSituations.adoptionCreditForm.adoptedChildren') as FormArray;
        dependents.removeAt(index);
    }

    get careProviders(): FormArray {
        return this.taxForm.get('personalInfo.dependentSection.careProviders') as FormArray;
    }

    addCareProvider(): void {
        const careProviderGroup = this.fb.group({
            providerName: ['', Validators.required],
            providerAddress: ['', Validators.required],
            identifyingNumber: ['', Validators.required],
            householdEmployee: ['', Validators.required],
            amountPaid: ['', Validators.required]
        });
        this.careProviders.push(careProviderGroup);
    }

    removeCareProvider(index: number): void {
        this.careProviders.removeAt(index);
    }

    // Método para manejar el cambio en los radio buttons
    onDigitalAssetsChange(value: string): void {
        this.showDigitalAssetsForm = value === 'Yes';
        if (!this.showDigitalAssetsForm) {
            // Reinicia las transacciones si el usuario selecciona "No"
            this.transactions = [];
        } else {
            // Asegúrate de tener al menos una transacción al iniciar
            if (this.transactions.length === 0) {
                this.createTransaction();
            }
        }
    }

    onOtherGainsChange(value: string): void {
        if (value === 'Yes') {
            this.showGainsLossesForm = true; // Muestra la sección para ganancias y pérdidas
        } else {
            this.showGainsLossesForm = false; // Oculta la sección si el usuario selecciona "No"
            this.transactions = []; // Limpia las transacciones existentes
        }
    }

    createTransaction(): FormGroup {
        return this.fb.group({
            description: ['', Validators.required],
            acquisitionDate: ['', Validators.required],
            saleDate: ['', Validators.required],
            salePrice: ['', [Validators.required, Validators.min(0)]],
            costBasis: ['', [Validators.required, Validators.min(0)]],
            adjustment: [''],
            category: ['', Validators.required],
            codes: ['', Validators.required]
        });
    }

    get digitalAssetsDetails(): FormArray {
        return this.taxForm.get('incomeInfo.digitalAssetsSection.digitalAssetsDetails') as FormArray;
    }

    addDigitalTransaction(): void {
        const newTransaction = this.createTransaction();
        this.digitalAssetsDetails.push(newTransaction);
    }

    removeDigitalTransaction(index: number): void {
        this.digitalAssetsDetails.removeAt(index);
    }

    get gainsLossesDetails(): FormArray {
        return this.taxForm.get('incomeInfo.otherGainsLossesSection.gainsLossesDetails') as FormArray;
    }

    addGainsLossesTransaction(): void {
        const newTransaction = this.createTransaction();
        this.gainsLossesDetails.push(newTransaction);
    }

    removeGainsLossesTransaction(index: number): void {
        this.gainsLossesDetails.removeAt(index);
    }

    get installmentSalesDetails(): FormArray {
        return this.taxForm.get('incomeInfo.propertySalesSection.installmentSalesDetails') as FormArray;
    }

    addInstallmentSale(): void {
        this.installmentSalesDetails.push(this.fb.group({
            propertyDescription: [''],
            businessUse: [''],
            dateAcquired: [''],
            dateSold: [''],
            soldToRelatedParty: [''],
            receivedFinalPaymentInTime: [''],
            priceDeterminableByYearEnd: [''],
            sellingPrice: [''],
            buyerAssumedDebts: [''],
            costOrBasis: [''],
            depreciationAllowed: [''],
            commissions: [''],
            paymentsReceived: [''],
            priorPaymentsReceived: [''],
            category: [''],
            relatedPartyName: [''],
            relatedPartyStreet: [''],
            relatedPartyCity: [''],
            relatedPartyState: [''],
            relatedPartyZip: [''],
            relatedPartyTIN: [''],
            relatedPartyDisposed: [''],
            conditionA: [false],
            conditionB: [false],
            conditionC: [false],
            conditionD: [false],
            conditionE: [false],
            line30: [null],
            line31: [null],
            line33: [null]
        }));
    }

    removeInstallmentSale(index: number) {
        this.installmentSalesDetails.removeAt(index);
    }

    // Método para actualizar dinámicamente el campo 'gainOrLoss'
    private updateGainOrLoss(control: AbstractControl): void {
        const salePrice = parseFloat(control.get('salePrice')?.value || '0');
        const costBasis = parseFloat(control.get('costBasis')?.value || '0');
        const gainOrLoss = salePrice - costBasis;

        console.log("Calculating Gain or Loss");
        console.log("salePrice:", salePrice, "costBasis:", costBasis, "gainOrLoss:", gainOrLoss);

        control.get('gainOrLoss')?.setValue(gainOrLoss, { emitEvent: false });
    }

    get casualtiesDetails(): FormArray {
        return this.taxForm.get('incomeInfo.casualtiesTheftsSection.casualtiesDetails') as FormArray;
    }

    // Método para agregar una nueva propiedad al FormArray
    addCasualty(): void {
        const casualtyGroup = this.fb.group({
            propertyType: ['', Validators.required],
            cityState: ['', Validators.required],
            zipCode: ['', Validators.required],
            dateAcquired: ['', Validators.required],
            costBasis: [0, [Validators.required, Validators.min(0)]],
            insuranceReimbursement: [0, [Validators.required, Validators.min(0)]],
            fairMarketValueBefore: [0, [Validators.required, Validators.min(0)]],
            fairMarketValueAfter: [0, [Validators.required, Validators.min(0)]],
            propertyUse: ['', Validators.required],
            eventName: ['', Validators.required],
            eventDate: ['', Validators.required],
            lossType: ['', Validators.required],
            femaType: [''],
            femaNumber: [''],
            applyLossToPriorYear: [false],
            category: [''] // 🆕 campo agregado
        });
        this.casualtiesDetails.push(casualtyGroup);
    }

    // Método para eliminar una propiedad del FormArray
    removeCasualty(index: number): void {
        this.casualtiesDetails.removeAt(index);
    }

    // Método para manejar el cambio en la pregunta inicial
    onCasualtiesTheftsChange(value: string): void {
        if (value === 'No') {
            // Si selecciona "No", vaciamos el FormArray
            this.casualtiesDetails.clear();
        }
    }

    get ponziLosses(): FormArray {
        return this.taxForm.get('incomeInfo.ponziSchemeSection.ponziLosses') as FormArray;
    }

    addPonziLoss(): void {
        const ponziGroup = this.fb.group({
            responsibleName: ['', Validators.required],
            responsibleTIN: [''],
            responsibleAddress: [''],
            initialInvestment: [0, [Validators.required, Validators.min(0)]],
            subsequentInvestments: [0, [Validators.required, Validators.min(0)]],
            reportedIncome: [0, [Validators.required, Validators.min(0)]],
            withdrawals: [0, [Validators.required, Validators.min(0)]],
            actualRecovery: [0, [Validators.required, Validators.min(0)]],
            sipcRecovery: [0, [Validators.required, Validators.min(0)]],
            thirdPartyRecovery: ['', Validators.required],
        });

        this.ponziLosses.push(ponziGroup);
    }

    removePonziLoss(index: number): void {
        this.ponziLosses.removeAt(index);
    }

    get ConflictSale(): FormArray {
        return this.taxForm.get('incomeInfo.ponziSchemeSection.conflictSales') as FormArray;
    }

    addConflictSale() {
        const control = this.taxForm.get('incomeInfo.exchangePropertySection.conflictSales') as FormArray;
        control.push(this.fb.group({
            divestedPropertyDescription: [''],
            replacementPropertyDescription: [''],
            dateAcquired: [''],
            dateSold: [''],
            divestedSalePrice: [0],
            divestedBasis: [0],
            replacementCost: [0],
            ordinaryIncomeRecapture: [0]
        }));
    }

    removeConflictSale(index: number) {
        const control = this.taxForm.get('incomeInfo.exchangePropertySection.conflictSales') as FormArray;
        control.removeAt(index);
    }

    get kindExchangeDetails(): FormArray {
        return this.taxForm.get('incomeInfo.exchangePropertySection.kindExchangeDetails') as FormArray;
    }

    addExchange() {
        this.kindExchangeDetails.push(this.fb.group({
            propertyGivenUp: [''],
            propertyReceived: [''],
            dateGivenUp: [''],
            dateReceived: [''],
            businessUse: ['']
        }));
    }

    removeExchange(index: number) {
        this.kindExchangeDetails.removeAt(index);
    }

    get qofTransactions(): FormArray {
        return this.taxForm.get('incomeInfo.qualifiedOpportunityFundSection.qofTransactions') as FormArray;
    }

    addQofTransaction() {
        const group = this.fb.group({
            fundName: [''],
            fundEIN: [''],
            acquisitionDate: [''],
            saleDate: [''],
            saleProceeds: [0],
            costBasis: [0],
            adjustment: [0],
            codes: [''],
            category: ['F'],
            deferredGainOriginallyInvested: [0],
            recognizedGain: [0],
            isDeferredGainIncluded: [false]
        });
        this.qofTransactions.push(group);
    }

    removeQofTransaction(index: number) {
        this.qofTransactions.removeAt(index);
    }

    onFemaDeclarationChange(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.taxForm.get('femaType')?.setValidators([Validators.required]);
            this.taxForm.get('femaNumber')?.setValidators([Validators.required]);
        } else {
            this.taxForm.get('femaType')?.clearValidators();
            this.taxForm.get('femaNumber')?.clearValidators();
        }
        this.taxForm.get('femaType')?.updateValueAndValidity();
        this.taxForm.get('femaNumber')?.updateValueAndValidity();
    }

    onCapitalGainCheckboxChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const isChecked = checkbox.checked;

        console.log("isChecked", isChecked);

        const amountControl = this.taxForm.get('capitalGainOrLossAmount');

        if (isChecked) {
            amountControl?.setValue(0); // Reset value to 0
            amountControl?.disable();  // Disable the field
        } else {
            amountControl?.enable();   // Enable the field
        }
    }

    calculateAmountYouOwe(): number {
        const line33 = this.taxForm.get('line33')?.value || 0;
        const line24 = this.taxForm.get('line24')?.value || 0;
        return Math.max(0, line33 - line24); // Retorna 0 si el resultado es negativo
    }

    calculateAmountOwed(): void {
        const totalTax = this.taxForm.get('totalTax')?.value || 0;
        const totalPayments = this.taxForm.get('totalPayments')?.value || 0;
        this.amountOwed = totalTax - totalPayments;
    }

    selectDeclarationType(type: string): void {
        this.selectedDeclarationType = type;
        console.log(`Selected Declaration Type: ${type}`);
        // Aquí puedes manejar la lógica para mostrar los formularios correspondientes
    }

    toggleIncomeType(type: string): void {
        if (this.selectedIncomeTypes.has(type)) {
            this.selectedIncomeTypes.delete(type);
        } else {
            this.selectedIncomeTypes.add(type);
        }

        // Puedes guardar los valores en el formulario también si quieres enviarlos por ahí
        const updatedTypes = Array.from(this.selectedIncomeTypes);
        this.taxForm.get('declarationType')?.setValue(updatedTypes);
        this.taxForm.get('declarationType')?.markAsDirty();
        this.taxForm.get('declarationType')?.markAsTouched();
        this.taxForm.get('declarationType')?.updateValueAndValidity();
    }

    onResidencyStatusChange(value: string): void {
        if (value === 'Non-Resident') {
            // Habilita Estate y Trust solo si es Non-Resident
            this.taxForm.get('filingStatus')?.setValue(null); // Reiniciar valor previo
        } else {
            // Limpia Estate y Trust si no es Non-Resident
            if (['Estate', 'Trust'].includes(this.taxForm.get('filingStatus')?.value)) {
                this.taxForm.get('filingStatus')?.setValue(null);
            }
        }
    }

    // Método para calcular la línea 13c
    updateLine13c(): void {
        const businessIncomeDeduction = parseFloat(this.taxForm.get('businessIncomeDeduction')?.value || '0');
        const estateTrustExemptions = parseFloat(this.taxForm.get('estateTrustExemptions')?.value || '0');
        const total = businessIncomeDeduction + estateTrustExemptions;
        this.taxForm.patchValue({ line13c: total.toFixed(2) }, { emitEvent: false });
    }

    // Método para obtener la línea 13c (puede ser usado en la plantilla)
    calculateLine13c(): string {
        const businessIncomeDeduction = parseFloat(this.taxForm.get('businessIncomeDeduction')?.value || '0');
        const estateTrustExemptions = parseFloat(this.taxForm.get('estateTrustExemptions')?.value || '0');
        return (businessIncomeDeduction + estateTrustExemptions).toFixed(2);
    }

    // Método para calcular la línea 23d
    updateLine23d(): void {
        const taxOnIncomeNotConnected = parseFloat(this.taxForm.get('taxOnIncomeNotConnected')?.value || '0');
        const otherTaxesSchedule2 = parseFloat(this.taxForm.get('otherTaxesSchedule2')?.value || '0');
        const transportationTax = parseFloat(this.taxForm.get('transportationTax')?.value || '0');
        const total = taxOnIncomeNotConnected + otherTaxesSchedule2 + transportationTax;
        this.taxForm.patchValue({ line23d: total.toFixed(2) }, { emitEvent: false });
    }

    // Método para obtener la línea 23d (puede ser usado en la plantilla)
    calculateLine23d(): string {
        const taxOnIncomeNotConnected = parseFloat(this.taxForm.get('taxOnIncomeNotConnected')?.value || '0');
        const otherTaxesSchedule2 = parseFloat(this.taxForm.get('otherTaxesSchedule2')?.value || '0');
        const transportationTax = parseFloat(this.taxForm.get('transportationTax')?.value || '0');
        return (taxOnIncomeNotConnected + otherTaxesSchedule2 + transportationTax).toFixed(2);
    }

    calculateFederalTaxTotal() {
        const w2 = +this.taxForm.get('federalTaxWithheldW2')?.value || 0;
        const f1099 = +this.taxForm.get('federalTaxWithheld1099')?.value || 0;
        const other = +this.taxForm.get('federalTaxWithheldOther')?.value || 0;

        this.taxForm.get('federalTaxWithheldTotal')?.setValue(w2 + f1099 + other, { emitEvent: false });
    }

    isEligibleForAdoptionCredit(): boolean {
        const adoptionCreditForm = this.taxForm.get('adoptionCreditForm')?.value;

        if (!adoptionCreditForm) {
            return false; // Retorna false si no existe la sección de adopción
        }

        const { paidAdoptionExpenses2023, paidAdoptionExpenses2024, adoptedSpecialNeedsChild } = adoptionCreditForm;

        return paidAdoptionExpenses2023 && paidAdoptionExpenses2024 && adoptedSpecialNeedsChild;
    }

    canShow8919Fields(formKey: 'form8919' | 'form8919Spouse'): boolean {
        const group = this.taxForm.get(`employmentInfo.${formKey}`);
        return !!(
            group?.get('workedForFirm')?.value &&
            group.get('received1099')?.value &&
            group.get('noTaxWithheld')?.value &&
            group.get('shouldBeEmployee')?.value &&
            group.get('reasonCode')?.value
        );
    }

    addFirmRow(forSpouse: boolean = false): void {
        const group = this.fb.group({
            firmName: [''],
            firmEIN: [''],
            reasonCode: [''],
            irsDate: [''],
            received1099Checkbox: [false],
            wagesAmount: ['']
        });

        if (forSpouse) {
            (this.taxForm.get('form8919Spouse.firms') as FormArray).push(group);
        } else {
            (this.taxForm.get('form8919.firms') as FormArray).push(group);
        }
    }

    getFirmData(groupKey: 'form8919' | 'form8919Spouse'): any[] {
        const firmsArray = this.taxForm.get(`${groupKey}.firms`) as FormArray;
        return firmsArray.controls.map(firmGroup => ({
            firmName: firmGroup.get('firmName')?.value,
            firmEIN: firmGroup.get('firmEIN')?.value,
            reasonCode: firmGroup.get('reasonCode')?.value,
            irsDate: firmGroup.get('irsDate')?.value,
            received1099Checkbox: firmGroup.get('received1099Checkbox')?.value,
            wagesAmount: firmGroup.get('wagesAmount')?.value
        }));
    }

    // Reutilizamos la misma estructura de grupo para ambos
    createK1Group(): FormGroup {
        return this.fb.group({
            k1EntityName: [''],
            k1IncomeAmount: [0, [Validators.required]],
            k1Notes: ['']
        });
    }

    // -------- SHORT TERM K-1 --------
    get k1ShortTermControls(): FormArray {
        return this.taxForm.get('employmentInfo.scheduleK1ShortTerm.k1ShortTermEntries') as FormArray;
    }

    addK1ShortTerm(): void {
        this.k1ShortTermControls.push(this.createK1Group());
    }

    removeK1ShortTerm(index: number): void {
        this.k1ShortTermControls.removeAt(index);
    }

    // -------- LONG TERM K-1 --------
    get k1LongTermControls(): FormArray {
        return this.taxForm.get('employmentInfo.scheduleK1LongTerm.k1LongTermEntries') as FormArray;
    }

    addK1LongTerm(): void {
        this.k1LongTermControls.push(this.createK1Group());
    }

    removeK1LongTerm(index: number): void {
        this.k1LongTermControls.removeAt(index);
    }


    get signatureSection(): FormGroup {
        return this.taxForm.get('finalReviewSection.signatureSection') as FormGroup;
    }

    get thirdPartySection(): FormGroup {
        return this.taxForm.get('finalReviewSection.thirdPartySection') as FormGroup;
    }

    get w2List() {
        return this.taxForm.get('employmentInfo.w2List') as FormArray;
    }

    get form1099List() {
        return this.taxForm.get('form1099List') as FormArray;
    }

    handleUploadedFiles(files: UploadedTaxFile[]) {
        files.forEach(file => {
            if (file.type === 'W2') {
                (this.taxForm.get('employmentInfo.w2List') as FormArray).push(this.createW2Form());
            }

            if (file.type === '1099-NEC' || file.type === '1099-K') {
                (this.taxForm.get('form1099List') as FormArray).push(this.create1099Form());
            }

            // puedes seguir agregando otros tipos: 1099-R, SSA-1099, etc.
        });
    }

    createW2Form(): FormGroup {
        return this.fb.group({
            employerName: [''],
            employerEIN: [''],
            wages: [0],
            federalTaxWithheld: [0],
            // ...
        });
    }

    create1099Form(): FormGroup {
        return this.fb.group({
            payerName: [''],
            payerEIN: [''],
            nonemployeeCompensation: [0],
            backupWithholding: [0],
            // ...
        });
    }

    onFilesSelected(event: Event) {
        const input = event.target as HTMLInputElement | null;
        if (!input?.files || input.files.length === 0) {
            return;
        }
        const newFiles = Array.from(input.files);
        this.uploadedFiles = [...this.uploadedFiles, ...newFiles];
        input.value = '';
    }

    removeUploadedFile(index: number) {
        this.uploadedFiles = this.uploadedFiles.filter((_, i) => i !== index);
    }

    getRelatedPartyExchanges(): FormGroup[] {
        const details = this.taxForm.get('incomeInfo.exchangePropertySection.kindExchangeDetails') as FormArray;
        return details.controls.filter(group => group.get('relatedPartyExchange')?.value === 'Yes') as FormGroup[];
    }

    getNonLikeKindExchanges(): FormGroup[] {
        const details = this.taxForm.get('incomeInfo.exchangePropertySection.kindExchangeDetails') as FormArray;
        return details.controls.filter(group => group.get('givenUpAdditionalProperty')?.value === 'Yes') as FormGroup[];
    }

    getExchangesWithAdditionalProperty(): FormGroup[] {
        const details = this.taxForm.get('incomeInfo.exchangePropertySection.kindExchangeDetails') as FormArray;
        return details.controls.filter(group => group.get('receivedAdditionalProperty')?.value === 'Yes') as FormGroup[];
    }

    getExchangesWithPossibleDepreciation(): FormGroup[] {
        const details = this.taxForm.get('incomeInfo.exchangePropertySection.kindExchangeDetails') as FormArray;
        return details.controls.filter(group => {
            const value = group.get('wasDepreciated')?.value;
            return value === 'Yes';
        }) as FormGroup[];
    }

    get rate28GainDetails(): FormArray {
        return this.taxForm.get('incomeInfo.rate28GainSection.rate28GainDetails') as FormArray;
    }

    add28RateGainEntry(): void {
        this.rate28GainDetails.push(this.fb.group({
            assetType: ['', Validators.required],
            description: [''],
            acquisitionDate: [''],
            saleDate: [''],
            salePrice: [0, [Validators.min(0)]],
            costBasis: [0, [Validators.min(0)]],
            gainOrLoss: [0] // O calcula automáticamente
        }));
    }

    remove28RateGainEntry(index: number): void {
        this.rate28GainDetails.removeAt(index);
    }

    on28RateGainChange(value: string): void {
        this.show28RateGainForm = value === 'Yes';
        if (value === 'Yes' && this.rate28GainDetails.length === 0) {
            this.add28RateGainEntry();
        } else if (value === 'No') {
            this.rate28GainDetails.clear();
        }
    }

    get rentalPropertiesArray(): FormArray {
        return this.taxForm.get('incomeInfo.scheduleESection.rentalProperties') as FormArray;
    }

    addRentalProperty() {
        this.rentalPropertiesArray.push(
            this.fb.group({
                address: [''],
                propertyType: [''],
                fairRentalDays: [0],
                personalUseDays: [0],
                rentsReceived: [0],
                royaltyReceived: [0],
                qjv: [false],

                // Gastos Parte I
                advertising: [0],
                autoTravel: [0],
                cleaningMaintenance: [0],
                commissions: [0],
                insurance: [0],
                legalFees: [0],
                managementFees: [0],
                mortgageInterest: [0],
                otherInterest: [0],
                repairs: [0],
                supplies: [0],
                taxes: [0],
                utilities: [0],
                depreciation: [0],
                priorYearUnallowedCRD: [0],
                otherExpenses: [0],

                // At-Risk status + Parte II
                isAtRisk: [''],
                adjustedBasisStartYear: [0],
                yearIncreases: [0],
                yearDecreases: [0],

                // Parte III - Detailed
                investmentAtEffectiveDate: [0],
                increasesAtEffectiveDate: [0],
                decreasesAtEffectiveDate: [0],
                priorYearLine19b: [0],
                increasesSince: [0],
                decreasesSince: [0]
            })
        );
    }

    removeRentalProperty(index: number) {
        this.rentalPropertiesArray.removeAt(index);
    }

    get royaltiesArray(): FormArray {
        return this.taxForm.get('incomeInfo.scheduleESection.royalties') as FormArray;
    }

    addRoyalty() {
        this.royaltiesArray.push(
            this.fb.group({
                address: [''],
                propertyType: ['6'],
                royaltyReceived: [0],
                rentsReceived: [0],
                isPTP: [false],
                isPassive: [''],
                isAtRisk: [''],
                taxYear: [2024],
                advertising: [0],
                autoTravel: [0],
                cleaningMaintenance: [0],
                commissions: [0],
                insurance: [0],
                legalFees: [0],
                managementFees: [0],
                mortgageInterest: [0],
                otherInterest: [0],
                repairs: [0],
                supplies: [0],
                taxes: [0],
                utilities: [0],
                depreciation: [0],
                otherExpenses: [0]
            })
        );
    }

    removeRoyalty(index: number) {
        this.royaltiesArray.removeAt(index);
    }

    get k1EntitiesArray(): FormArray {
        return this.taxForm.get('employmentInfo.BusinessOwnerSection.k1Entities') as FormArray;
    }

    addK1Entity(): void {
        this.k1EntitiesArray.push(
            this.fb.group({
                entityName: [''],
                entityType: [''], // 'P' for Partnership, 'S' for S Corp
                isForeign: [''],
                ein: [''],
                requiresBasisComputation: [''],
                anyNotAtRisk: [''],
                passiveLossAllowed: [0],
                passiveIncome: [0],
                nonPassiveLossAllowed: [0],
                section179Expense: [0],
                nonPassiveIncome: [0],
            })
        );
    }

    removeK1Entity(index: number): void {
        this.k1EntitiesArray.removeAt(index);
    }

    get remicEntitiesArray(): FormArray {
        return this.taxForm.get('employmentInfo.BusinessOwnerSection.remicSection') as FormArray;
    }

    addRemic() {
        this.remicEntitiesArray.push(this.fb.group({
            name: [''],
            ein: [''],
            excessInclusion: [0],
            taxableIncome: [0],
            otherIncome: [0]
        }));
    }

    removeRemic(index: number) {
        this.remicEntitiesArray.removeAt(index);
    }

    get estatesAndTrustsArray(): FormArray {
        return this.taxForm.get('employmentInfo.BenefitsAndTrustSection.estatesAndTrusts') as FormArray;
    }

    addEstateOrTrust(): void {
        this.estatesAndTrustsArray.push(
            this.fb.group({
                name: [''],
                ein: [''],
                passiveDeductionAllowed: [0],
                passiveIncome: [0],
                nonPassiveLoss: [0],
                otherNonPassiveIncome: [0]
            })
        );
    }

    removeEstateOrTrust(index: number): void {
        this.estatesAndTrustsArray.removeAt(index);
    }

    get farmRentalSections(): FormArray {
        return this.taxForm.get('incomeInfo.farmRentalWrapper.farmRentalSections') as FormArray;
    }

    addFarm(): void {
        this.farmRentalSections.push(
            this.fb.group({
                farmActivityName: [''],
                einForm4835: [''],
                activelyParticipate: ['No'],
                investmentRisk: ['none'],
                line1Income: [0],
                line2aCoopDist: [0],
                line2bTaxable: [0],
                line3aAgriPayments: [0],
                line3bTaxable: [0],
                line4aCCCReported: [0],
                line4bCCCForfeited: [0],
                line4cCCCTaxable: [0],
                line5aCropInsurance: [0],
                line5bTaxable: [0],
                line5cElection: [false],
                line5dDeferred: [0],
                line6OtherIncome: [0],
                line8CarTruck: [0],
                line9Chemicals: [0],
                line10Conservation: [0],
                line11CustomHire: [0],
                line12Depreciation: [0],
                line13EmployeeBenefits: [0],
                line14Feed: [0],
                line15Fertilizers: [0],
                line16Freight: [0],
                line17Fuel: [0],
                line18Insurance: [0],
                line19aMortgage: [0],
                line19bOtherInterest: [0],
                line20Labor: [0],
                line21Pension: [0],
                line22aRentVehicles: [0],
                line22bRentOther: [0],
                line23Repairs: [0],
                line24Seeds: [0],
                line25Storage: [0],
                line26Supplies: [0],
                line27Taxes: [0],
                line28Utilities: [0],
                line29Vet: [0],
                priorYearLoss: [0],
                priorYearUnallowedCRD: [0],
                line30OtherExpenses: this.fb.array([])
            })
        );
    }

    removeFarm(index: number): void {
        this.farmRentalSections.removeAt(index);
    }

    addOtherExpense(farmIndex: number) {
        const expenses = this.farmRentalSections.at(farmIndex).get('line30OtherExpenses') as FormArray;
        expenses.push(
            this.fb.group({
                description: [''],
                amount: [0]
            })
        );
    }

    removeOtherExpense(farmIndex: number, expenseIndex: number) {
        const expenses = this.farmRentalSections.at(farmIndex).get('line30OtherExpenses') as FormArray;
        expenses.removeAt(expenseIndex);
    }

    get gamblingEntries(): FormArray {
        return this.taxForm.get('employmentInfo.gamblingIncomeSection.gamblingEntries') as FormArray;
    }

    addGamblingEntry() {
        const entry = this.fb.group({
            payerName: [''],
            payerEIN: [''],
            payerAddress: [''],
            dateWon: [''],
            amountWon: [0],
            federalWithheld: [0],
            stateWithheld: [0]
        });
        this.gamblingEntries.push(entry);
    }

    removeGamblingEntry(index: number) {
        this.gamblingEntries.removeAt(index);
    }

    get debtEntries(): FormArray {
        return this.taxForm.get('employmentInfo.cancellationOfDebtSection.debtEntries') as FormArray;
    }

    addDebtEntry() {
        this.debtEntries.push(this.fb.group({
            creditorName: [''],
            creditorTIN: [''],
            creditorAddress: [''],
            dateCancelled: [''],
            amountCancelled: [0],
            descriptionOfDebt: [''],
            reason: [''],
            propertyFairMarketValue: [0]
        }));
    }

    removeDebtEntry(index: number) {
        this.debtEntries.removeAt(index);
    }

    get usPresenceRecords() {
        return this.taxForm.get('employmentInfo.foreignEarnedIncomeSection.usPresenceRecords') as FormArray;
    }

    addUSPresenceRecord() {
        this.usPresenceRecords.push(
            this.fb.group({
                dateArrived: [''],
                dateLeft: [''],
                daysOnBusiness: [0],
                incomeEarnedUS: [0]
            })
        );
    }

    removeUSPresenceRecord(index: number) {
        this.usPresenceRecords.removeAt(index);
    }

    get foreignTravelRecords() {
        return this.taxForm.get('employmentInfo.foreignEarnedIncomeSection.foreignTravelRecords') as FormArray;
    }

    addForeignTravelRecord() {
        this.foreignTravelRecords.push(
            this.fb.group({
                countryName: [''],
                dateArrived: [''],
                dateLeft: [''],
                fullDaysInCountry: [0],
                daysInUSOnBusiness: [0],
                incomeEarnedUS: [0]
            })
        );
    }

    removeForeignTravelRecord(index: number) {
        this.foreignTravelRecords.removeAt(index);
    }

    get hdhpCoverageRecords() {
        return this.taxForm.get('deductionsAndAdjustments.form8853.hdhpCoverageRecords') as FormArray;
    }

    addHDHPCoverageRecord() {
        const record = this.fb.group({
            coverageType: [''],   // Self-Only | Family
            monthsCovered: ['']   // 1–12
        });
        this.hdhpCoverageRecords.push(record);
    }

    removeHDHPCoverageRecord(index: number) {
        this.hdhpCoverageRecords.removeAt(index);
    }

    get otherIncomeZList(): FormArray {
        return this.taxForm.get('deductionsAndAdjustments.otherIncomes.otherIncomeZList') as FormArray;
    }

    addOtherIncomeZ() {
        const entry = this.fb.group({
            incomeType: ['', Validators.required],
            incomeAmount: [0, Validators.required],
        });
        this.otherIncomeZList.push(entry);
    }

    removeOtherIncomeZ(index: number) {
        this.otherIncomeZList.removeAt(index);
    }

    get otherAdjustmentsZList(): FormArray {
        return this.taxForm.get('deductionsAndAdjustments.otherIncomes.otherAdjustmentsZList') as FormArray;
    }

    addOtherAdjustmentZ() {
        const entry = this.fb.group({
            incomeType: ['', Validators.required],
            incomeAmount: [0, Validators.required],
        });
        this.otherIncomeZList.push(entry);
    }

    removeOtherAdjustmentZ(index: number) {
        this.otherIncomeZList.removeAt(index);
    }

    get scheduleCInfo() {
        return this.taxForm.get('employmentInfo.scheduleCSection.scheduleCInfo') as FormArray;
    }

    addBusiness() {
        this.scheduleCInfo.push(
            this.fb.group({
                businessName: [''],
                businessCode: [''],
                employerEIN: [''],
                businessAddress: [''],
                businessCity: [''],
                businessState: [''],
                businessZip: [''],
                businessDescription: [''],

                // INCOME
                grossIncome: [0],
                expenses: [0],
                netProfit: [0],
                grossReceipts: [0],
                returnsAllowances: [0],
                otherIncome: [0],
                statutoryEmployee: [false],
                federalTaxWithheld: [0],

                // SETTINGS
                accountingMethod: ['Cash'],
                materialParticipation: ['Yes'],
                madePayments: ['No'],
                requiredForm1099: ['No'],
                contributedToQualifiedPlan: ['No'],
                qualifiedPlanContributionAmount: [0],
                paidHealthInsuranceAsSelfEmployed: ['No'],
                healthInsuranceAmount: [0],
                hadEarlyWithdrawalPenalty: ['No'],
                earlyWithdrawalPenaltyAmount: [0],
                investmentRisk: ['noneRisk'],
                newBusiness: [false],

                // INVENTORY
                inventoryMethod: ['cost'],
                inventoryChange: ['no'],

                // EXPENSES
                advertising: [0],
                carTruckExpenses: [0],
                commissionsFees: [0],
                contractLabor: [0],
                depletion: [0],
                depreciation: [0],
                employeeBenefits: [0],
                insurance: [0],
                mortgageInterest: [0],
                otherInterest: [0],
                legalProfessionalServices: [0],
                officeExpense: [0],
                pensionPlans: [0],
                rentVehicles: [0],
                rentOtherProperty: [0],
                repairsMaintenance: [0],
                supplies: [0],
                taxesLicenses: [0],
                travelExpenses: [0],
                mealsDeductible: [0],
                utilities: [0],
                wages: [0],
                energyEfficientDeduction: [0],

                // COGS
                inventoryBeginning: [0],
                purchases: [0],
                costLabor: [0],
                materialsSupplies: [0],
                otherCosts: [0],
                inventoryEnding: [0],

                // OTHER EXPENSES
                otherExpensesDescription1: [''],
                otherExpensesAmount1: [0],
                otherExpensesDescription2: [''],
                otherExpensesAmount2: [0],
                otherExpensesDescription3: [''],
                otherExpensesAmount3: [0],
                otherExpensesDescription4: [''],
                otherExpensesAmount4: [0],
                totalOtherExpenses: [0],
            })
        );
    }

    removeBusiness(i: number) {
        this.scheduleCInfo.removeAt(i);
        this.showExpenses.splice(i, 1);
    }

    toggleExpenses(i: number): void {
        this.showExpenses[i] = !this.showExpenses[i];

    }

    get w2Info() {
        return this.taxForm.get('employmentInfo.w2Section.w2Info') as FormArray;
    }

    addW2() {
        this.w2Info.push(
            this.fb.group({
                employerEIN: [''],
                employerName: [''],
                employerAddress: [''],
                employerCity: [''],
                employerState: [''],
                employerZip: [''],
                controlNumber: [''],

                personalPropertyTax: [''],

                wages: [0],
                federalTaxWithheld: [0],
                socialSecurityWages: [0],
                socialSecurityTaxWithheld: [0],
                medicareWages: [0],
                medicareTaxWithheld: [0],
                socialSecurityTips: [0],
                allocatedTips: [0],
                dependentCareBenefitsAmount: [0],
                carryOverAmount: [0],
                unusedBenefits: [0],
                stateWages: [0],
                stateTaxWithheld: [0],
                WagesTips: [0],
                stateRealState: [0],

                localTaxWithheld: [0],
                localityName: [''],

                taxType: [''],
                taxAmount: [0]
            })
        );
    }

    removeW2(index: number) {
        this.w2Info.removeAt(index);
    }

    private getMarketplaceMonths() {

        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return months.map(m =>
            this.fb.group({
                month: [m],

                // User inputs
                monthlyPremium: [0, Validators.min(0)],
                slcsp: [0, Validators.min(0)],
                advancePayment: [0, Validators.min(0)],
            })
        );
    }


    get marketplaceMonths(): FormArray {
        return this.taxForm.get(
            'deductionsCreditsSection.premiumTaxCreditSection.marketplaceMonths'
        ) as FormArray;
    }

}

type UploadedTaxFile = {
    type: 'W2' | '1099-NEC' | '1099-K' | '1099-R' | 'SSA-1099';
    filename: string;
    content: any;
};
