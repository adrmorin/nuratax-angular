import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-ct2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-ct2.component.html',
  styleUrls: ['./form-ct2.component.css']
})
export class FormCT2Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    representativeName: [''],
    representativeSSN: [''],
    laborOrgName: [''],
    quarterEnding: [''],
    
    // Part I: Tax Calculation
    tier1Comp: [0], // Subject to 12.4%
    tier1MedComp: [0], // Subject to 2.9%
    tier1AddMedComp: [0], // Subject to 0.9%
    tier2Comp: [0], // Subject to 13.1%
    
    adjustments: [0],
    totalDeposits: [0]
  });

  // 2025 Constants (Estimates based on trend if 2025 not final, but using 2024/25 typical rates)
  TIER1_RATE = 0.124;
  TIER1_MED_RATE = 0.029;
  TIER1_ADD_MED_RATE = 0.009;
  TIER2_RATE = 0.131;

  // Limits
  TIER1_LIMIT = 176100; // 2025 Placeholder
  TIER2_LIMIT = 131100; // 2025 Placeholder

  // Computed Taxes
  tier1Tax = computed(() => {
    const comp = Math.min(this.form.get('tier1Comp')?.value || 0, this.TIER1_LIMIT);
    return comp * this.TIER1_RATE;
  });

  tier1MedTax = computed(() => (this.form.get('tier1MedComp')?.value || 0) * this.TIER1_MED_RATE);
  
  tier1AddMedTax = computed(() => (this.form.get('tier1AddMedComp')?.value || 0) * this.TIER1_ADD_MED_RATE);

  tier2Tax = computed(() => {
    const comp = Math.min(this.form.get('tier2Comp')?.value || 0, this.TIER2_LIMIT);
    return comp * this.TIER2_RATE;
  });

  totalTaxBeforeAdjustments = computed(() => 
    this.tier1Tax() + this.tier1MedTax() + this.tier1AddMedTax() + this.tier2Tax()
  );

  totalAdjustedTax = computed(() => 
    this.totalTaxBeforeAdjustments() + (this.form.get('adjustments')?.value || 0)
  );

  balanceDue = computed(() => 
    Math.max(0, this.totalAdjustedTax() - (this.form.get('totalDeposits')?.value || 0))
  );

  overpayment = computed(() => 
    Math.max(0, (this.form.get('totalDeposits')?.value || 0) - this.totalAdjustedTax())
  );

  onSubmit() {
    console.log('Form CT-2 Submitted', this.form.value);
  }
}
