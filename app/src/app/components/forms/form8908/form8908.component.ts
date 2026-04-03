import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8908',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8908.component.html',
  styleUrls: ['./form8908.component.css']
})
export class Form8908Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  // High-fidelity calculation signals
  homeCredit = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      ein: [''],
      line1: [0], // Number of energy efficient homes
      line3: [0]  // Total credit
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val);
    });
  }

  calculateValues(val: Record<string, number | string>): void {
      const homes = Number(val['line1']);
      const credit = homes * 2000; // 2025 energy efficient home rate example ($2000 per home)
      
      this.form.patchValue({
          line3: credit
      }, { emitEvent: false });

      this.homeCredit.set(credit);
  }

  onSubmit(): void {
    console.log('Form 8908 Data:', this.form.value);
  }
}
