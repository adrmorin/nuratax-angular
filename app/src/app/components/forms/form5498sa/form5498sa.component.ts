import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form5498sa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form5498sa.component.html',
  styleUrl: './form5498sa.component.css'
})
export class Form5498saComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    trusteeName: [''],
    trusteeTIN: [''],
    participantName: [''],
    participantTIN: [''],
    accountNum: [''],
    box1_archerContrib: [0],
    box2_totalContrib: [0],
    box3_priorYearContrib: [0],
    box4_rolloverContrib: [0],
    box5_fmv: [0],
    box6_isHSA: [false],
    box6_isArcher: [false],
    box6_isMA: [false]
  });

  onSubmit() {
    console.log('Form 5498-SA Submitted', this.form.value);
  }
}
