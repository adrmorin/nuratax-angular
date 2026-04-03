import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8955ssa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8955ssa.component.html',
  styleUrls: ['./form8955ssa.component.css']
})
export class Form8955ssaComponent implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  participantCount = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      planName: [''],
      planSponsorEin: [''],
      numParticipants: [0]
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      this.participantCount.set(Number(val['numParticipants']));
  }

  onSubmit(): void {
    console.log('Form 8955-SSA Data:', this.form.value);
  }
}
