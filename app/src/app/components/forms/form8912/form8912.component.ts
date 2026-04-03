import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';

interface Part3Bond {
  issuer: string;
  ein: string;
  amount: number;
}

interface Part4Bond {
  name: string;
  cusip: string;
  faceAmount: number;
  rate: number;
  dueDate: string;
}

@Component({
  selector: 'app-form8912',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form8912.component.html',
  styleUrls: ['./form8912.component.css']
})
export class Form8912Component {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    tin: [''],
    l2: [0],
    l5: [0],
    l7: [0],
    l8: [0],
    l10: [0],
    part3Bonds: this.fb.array([]),
    part4Bonds: this.fb.array([])
  });

  // Part III calculation
  l14 = signal(0);
  // Part IV calculation
  l20 = signal(0);

  get part3Bonds() { return this.form.get('part3Bonds') as FormArray; }
  get part4Bonds() { return this.form.get('part4Bonds') as FormArray; }

  addPart3Bond() {
    this.part3Bonds.push(this.fb.group({
      issuer: [''],
      ein: [''],
      amount: [0]
    }));
    this.updateSum3();
  }

  addPart4Bond() {
    this.part4Bonds.push(this.fb.group({
      name: [''],
      cusip: [''],
      faceAmount: [0],
      rate: [0],
      dueDate: ['']
    }));
    this.updateSum4();
  }

  updateSum3() {
    const total = this.part3Bonds.value.reduce((acc: number, curr: Part3Bond) => acc + (curr.amount || 0), 0);
    this.l14.set(total);
  }

  updateSum4() {
    const total = this.part4Bonds.value.reduce((acc: number, curr: Part4Bond) => acc + ((curr.faceAmount || 0) * (curr.rate || 0)), 0);
    this.l20.set(total);
  }

  // Intermediate Lines
  l1 = computed(() => this.l14() + this.l20());
  l3 = computed(() => this.l1() + (this.form.get('l2')?.value || 0));
  l6 = computed(() => this.l3() + (this.form.get('l5')?.value || 0));
  
  l9 = computed(() => (this.form.get('l7')?.value || 0) + (this.form.get('l8')?.value || 0));
  l11 = computed(() => Math.max(0, this.l9() - (this.form.get('l10')?.value || 0)));
  l12 = computed(() => Math.min(this.l6(), this.l11()));

  onSubmit() {
    console.log('Form 8912 Submitted', this.form.value);
  }
}
