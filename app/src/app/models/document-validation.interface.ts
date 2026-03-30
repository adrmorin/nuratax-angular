export interface DocumentMeta {
    documentType: 'ID' | 'LICENSE' | 'SSN_CARD' | 'W2' | 'UNKNOWN';
    issuingCountry?: string;
    issuingState?: string;
    documentNumber?: string;
    issueDate?: string;
    expirationDate?: string;
    sex?: string;
    formType?: string;
    taxYear?: string;
}

export interface PersonalInfo {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    secondLastName?: string;
    fullName?: string;
    dob?: string;
    residencyStatus?: string;
    ssn?: string;
    ssnLast4?: string;
}

export interface ContactInfo {
    address?: string;
    aptNo?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface W2Employer {
    name?: string;
    ein?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    controlNumber?: string;
}

export interface W2WagesAndTaxes {
    wages?: string;
    federalTaxWithheld?: string;
    socialSecurityWages?: string;
    socialSecurityTaxWithheld?: string;
    medicareWages?: string;
    medicareTaxWithheld?: string;
    socialSecurityTips?: string;
    allocatedTips?: string;
    dependentCareBenefits?: string;
    nonqualifiedPlans?: string;
    otherCompensation?: string;
    other?: string;
}

export interface W2StateAndLocal {
    state?: string;
    stateWages?: string;
    stateTaxWithheld?: string;
    localWages?: string;
    localTaxWithheld?: string;
    localityName?: string;
}

export interface W2SpecificData {
    employer?: W2Employer;
    wagesAndTaxes?: W2WagesAndTaxes;
    stateAndLocal?: W2StateAndLocal;
}

export interface DocumentValidationResponse {
    documentMeta?: DocumentMeta;
    personalInfo?: PersonalInfo;
    contactInfo?: ContactInfo;
    w2SpecificData?: W2SpecificData;
}
