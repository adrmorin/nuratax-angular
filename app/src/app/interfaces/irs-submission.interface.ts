export interface IrsSubmission {
  id: string;                 // UUID
  submissionId: string;
  depositId?: string;

  environment: 'ATS' | 'PROD';

  taxReturnId: string;        // UUID
  userId: string;             // UUID
  taxYear: number;
  formType: string;           // 1040, 1120, etc.

  localStatus: string;        // SUBMITTED, ACCEPTED, REJECTED, etc.
  lastStatusCheckedAt?: string;

  submittedAt: string;

  irsHttpStatus?: number;
  irsMessage?: string;
  irsErrorCode?: string;

  ackRetrieved?: boolean;
  ackStatus?: 'ACCEPTED' | 'REJECTED';
  ackRetrievedAt?: string;
}
