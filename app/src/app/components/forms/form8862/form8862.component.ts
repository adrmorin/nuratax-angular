import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-form8862',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8862.component.html',
  styleUrls: ['./form8862.component.css']
})
export class Form8862Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    taxYear: ['2025'],
    name: [''],
    ssn: [''],
    reclaimingEIC: [false],
    reclaimingCTC: [false],
    reclaimingODC: [false],
    reclaimingAOTC: [false],
    
    // Part II: EIC Questions
    eicChildName: [''],
    eicChildSSN: [''],
    eicDaysInUS: [0],
    
    // Part III: CTC/ODC
    ctcChildName: [''],
    ctcChildSSN: [''],
    ctcDaysInUS: [0],
    
    // Part IV: AOTC
    studentName: [''],
    studentSSN: [''],
    institutionEIN: ['']
  });

  onSubmit() {
    console.log('Form 8862 Submitted', this.form.value);
  }
}
