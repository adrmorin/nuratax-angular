import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form8950',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8950.component.html',
  styleUrls: ['./form8950.component.css']
})
export class Form8950Component implements OnInit {
  private fb = inject(FormBuilder);
  form!: FormGroup;
  
  vcpFee = signal(0);

  ngOnInit(): void {
    this.form = this.fb.group({
      planSponsor: [''],
      ein: [''],
      planName: [''],
      planNumber: [''],
      // Part I - User Fee
      totalAssets: [0], // Assets in the plan
      vcpUserFee: [0]  // Based on assets
    });

    this.form.valueChanges.subscribe(val => {
      this.calculateValues(val as {
          totalAssets: number
      });
    });
  }

  calculateValues(val: {
      totalAssets: number
  }): void {
      const assets = Number(val.totalAssets) || 0;
      let fee = 1500; // Base fee
      
      if (assets > 500000) fee = 3000;
      if (assets > 10000000) fee = 3500;

      this.form.patchValue({
          vcpUserFee: fee
      }, { emitEvent: false });

      this.vcpFee.set(fee);
  }

  onSubmit(): void {
      console.log('Form 8950 Data:', this.form.value);
  }
}
