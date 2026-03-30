export interface AnalysisResponse {
  success?: boolean;
  responseCode?: string;
  status?: string;
  message?: string;
  [key: string]: unknown;
}
