import { TaxReturnStatus } from "./taxReturnStatus-interfaces";

export interface TaxReturnResponseDto {

  // 🔹 Identificador
  taxReturnId: string; // UUID → string en frontend

  // 🔹 Estado del proceso
  status: TaxReturnStatus;

  // 🔹 Información IRS
  submissionId?: string;
  irsMessage?: string;
  irsAckCode?: string;

  // 🔹 PDF
  pdf?: number[];        // byte[] → number[]
  pdfFileName?: string;

  // 🔹 Errores
  hasErrors: boolean;
  errors?: string[];

  // 🔹 Timestamps
  submittedAt?: string; // Instant → ISO string
}
