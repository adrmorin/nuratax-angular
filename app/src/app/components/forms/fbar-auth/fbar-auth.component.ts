import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fbar-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fbar-auth.component.html',
  styleUrl: './fbar-auth.component.css'
})
export class FbarAuthComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    filerName: [''],
    tin: [''],
    spouseName: [''],
    spouseTIN: [''],
    isJoint: [false],
    dateSigned: ['']
  });

  onSubmit() {
    console.log('FBAR Auth Submitted', this.form.value);
  }
}
