import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form8898',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8898.component.html',
  styleUrl: './form8898.component.css'
})
// Form 8898 - Statement for Individuals Who Begin or End Bona Fide Residence in a U.S. Possession
export class Form8898Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ssn: [''],
    possessionName: ['USVI'], // Guam, AmSamoa, USVI, etc.
    part1_dateResidencyChange: [''],
    // Part II: Presence Test
    daysInPossession: [0],
    daysInUS: [0],
    daysElsewhere: [0],
    // Part V: Source of Income
    wagesDuringResidency: [0],
    wagesBeforeResidency: [0],
    interestDuringResidency: [0],
    interestBeforeResidency: [0]
  });

  onSubmit() {
    console.log('Form 8898 Submitted', this.form.value);
  }
}
