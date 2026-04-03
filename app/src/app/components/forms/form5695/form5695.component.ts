import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form5695',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5695.component.html',
  styleUrls: ['./form5695.component.css']
})
export class Form5695Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    streetAddress: [''],
    city: [''],
    state: [''],
    zip: [''],
    
    // Part I: Residential Clean Energy Credit
    solarElectric: [0],
    solarWater: [0],
    windEnergy: [0],
    geothermal: [0],
    batteryStorage: [0],
    hasMinBattery: [false], // Check for >= 3 kWh
    
    // Fuel Cells
    fuelCellCost: [0],
    fuelCellKW: [0],
    isMainHome: [true],
    
    // Carryforward
    carryforward2024: [0],
    taxLiabilityLimit: [0]
  });

  // Basic 30% credit calculation
  majorEquipmentSum = computed(() => {
    const v = this.form.value;
    return (v.solarElectric || 0) + (v.solarWater || 0) + (v.windEnergy || 0) + (v.geothermal || 0) + 
           (v.hasMinBattery ? (v.batteryStorage || 0) : 0);
  });

  baseCredit = computed(() => this.majorEquipmentSum() * 0.30);

  // Fuel cell limit logic: lesser of 30% cost or $1,000 per 0.5 kW
  fuelCellCredit = computed(() => {
    const cost = this.form.get('fuelCellCost')?.value || 0;
    const kw = this.form.get('fuelCellKW')?.value || 0;
    if (!this.form.get('isMainHome')?.value) return 0;
    
    const thirtyPercent = cost * 0.30;
    const kwLimit = (kw / 0.5) * 1000;
    return Math.min(thirtyPercent, kwLimit);
  });

  totalTentativeCredit = computed(() => 
    this.baseCredit() + this.fuelCellCredit() + (this.form.get('carryforward2024')?.value || 0)
  );

  finalCredit = computed(() => 
    Math.min(this.totalTentativeCredit(), this.form.get('taxLiabilityLimit')?.value || 999999)
  );

  carryforwardTo2026 = computed(() => 
    Math.max(0, this.totalTentativeCredit() - this.finalCredit())
  );

  onSubmit() {
    console.log('Form 5695 Submitted', this.form.value);
  }
}
