export interface TaxState {
  meta: {
    source_document: string;
    source_file_id: string;
    created_at: string;
    updated_at: string | null;
    answers_log: any[];
  };
  tax_info: {
    filing_status: string | null;
    gross_income: number | null;
    withholding: number | null;
    claimed_elsewhere: string | null;
    residency_status: string | null;
    age_of_taxpayer: number | null;
    dependents_count: number | null;
  };
  dependents: any[];
  expenses: {
    has_expenses: string | null;
    medical_expenses: number | null;
    charity: number | null;
    saving_accounts: number | null;
    disasters: number | null;
    retirement_plan_contributions: number | null;
    mortgage_interest_1098: string | null;
    details: any[];
  };
  credits: {
    has_credits: string | null;
    child_tax_credit: { eligible: string | null; details: string | null };
    earned_income_tax_credit: { eligible: string | null; details: string | null };
    savers_credit: { eligible: string | null; details: string | null };
    child_dependent_care_credit: { eligible: string | null; details: string | null };
    american_opportunity_credit: { eligible: string | null; details: string | null };
  };
  adjustment: {
    requires_adjustment: string | null;
    adjustment_description: string | null;
    reported_cost_text: string | null;
    reported_cost_numeric: number | null;
    reported_cost_reported_to_irs: string | null;
    correct_cost_text: string | null;
    correct_cost_numeric: number | null;
    column_f_code: string | null;
    column_g_value: number | null;
  };
  other: {
    is_resident: string | null;
    blindness: string | null;
    additional_notes: string | null;
  };
  final_checks: {
    required_fields_complete: boolean;
    complete_timestamp: string | null;
  };
}
