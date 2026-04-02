export interface Form1099LtcData {
    payer: {
        name: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
        telephoneNo: string;
        tin: string;
    };
    recipient: {
        tin: string;
        accountNumber: string;
    };
    policyholder: {
        name: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
    };
    insured: {
        name: string;
        streetAddress: string;
        city: string;
        state: string;
        zipCode: string;
        isDifferentFromPolicyholder: boolean;
    };
    box1: number;
    box2: number;
    box3PerDiem: boolean;
    box3Reimbursed: boolean;
    box4QualifiedContract: boolean;
    box5ChronicallyIll: boolean;
    box5TerminallyIll: boolean;
    box5LatestCertificationDate: string;
}
