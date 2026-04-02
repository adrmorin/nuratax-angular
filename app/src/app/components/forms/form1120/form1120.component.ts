import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form1120',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1120.component.html',
  styleUrls: ['./form1120.component.css']
})
export class Form1120Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: [''], address: [''], cityStateZip: [''],
      ein: [''], dateIncorporated: [''], totalAssets: [''],
      consolidatedReturn: [false], personalHoldingCo: [false], personalServiceCorp: [false], schM3Attached: [false],
      initialReturn: [false], finalReturn: [false], nameChange: [false], addressChange: [false],
      // Income
      line1a: [''], line1b: [''], line1c: [''], line2: [''], line3: [''], line4: [''], line5: [''], line6: [''], line7: [''], line8: [''], line9: [''], line10: [''], line11: [''],
      // Deductions
      line12: [''], line13: [''], line14: [''], line15: [''], line16: [''], line17: [''], line18: [''], line19: [''], line20: [''], line21: [''], line22: [''], line23: [''], line24: [''], line25: [''], line26: [''], line27: [''],
      // Tax/Payments
      line28: [''], line29: [''], line30: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 1120 (2025):', this.form.value);
  }
}