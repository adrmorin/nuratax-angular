import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form965d',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form965d.component.html',
  styleUrls: ['./form965d.component.css']
})
export class Form965dComponent {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      // Part I
      transferor_name: [''], transferor_tin: [''], transferor_addr: [''],
      // Part II
      transferee_name: [''], transferee_tin: [''], transferee_addr: [''],
      // Part III
      scorp_name: [''], scorp_tin: [''],
      // Part IV
      event_date: [''], is_death: [false], deferred_pct: [''], event_desc: ['']
    });
  }

  onSubmit() {
    console.log('Submitted Form 965-D (2025):', this.form.value);
  }
}
