import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8862',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8862.component.html',
  styleUrls: ['./form8862.component.css']
})
export class Form8862Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity state signals
  isEligible = signal(true);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ssn: [''],
      part1Q1: ['yes'], // Child EITC
      part2Q1: ['yes']  // Qualifying child
    });
  }

  onSubmit(): void {
    console.log('Form 8862 Data:', this.form.value);
  }
}
