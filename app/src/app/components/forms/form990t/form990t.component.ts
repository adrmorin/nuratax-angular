import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form990t',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form990t.component.html',
  styleUrls: ['./form990t.component.css']
})
export class Form990tComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      addressChange: [false],
      exemptSectionValue: [''],
      bookValueAssets: [''],
      ein: [''],
      groupExemptionNum: [''],
      amendedReturn: [false],
      organizationType: ['corp'],
      credits8941: [false], credits2439: [false], credits3800: [false],
      consolReturnI: [false], schedulesAAdj: [''],
      custodianName: [''], custodianPhone: [''],
      // Part I
      line1: [''], line2: [''], line3: [''], line4: [''], line5: [''], line6: [''], line7: [''], line8: ['1000'], line9: [''], line10: [''], line11: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 990-T (2025):', this.form.value);
  }
}