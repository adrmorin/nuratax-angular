import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form1041-schedule-g',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form1041-schedule-g.component.html',
  styleUrl: './form1041-schedule-g.component.css'
})
export class Form1041ScheduleGComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: [''],
    ein: [''],
    l1a: [0], l1b: [0], l1c: [0],
    l2a: [0], l2b: [0], l2c: [0], l2d: [0],
    l4: [0], l5: [0], l6: [0], l7: [0], l8: [0],
    l11: [0], l12: [0], l14: [0], l15: [0], l16: [0]
  });

  // Part I Calculations
  l1d = computed(() => (this.form.get('l1a')?.value || 0) + (this.form.get('l1b')?.value || 0) + (this.form.get('l1c')?.value || 0));

  // Part II Calculations
  l2e = computed(() => 
    (this.form.get('l2a')?.value || 0) + 
    (this.form.get('l2b')?.value || 0) + 
    (this.form.get('l2c')?.value || 0) + 
    (this.form.get('l2d')?.value || 0)
  );
  l3 = computed(() => Math.max(0, this.l1d() - this.l2e()));

  // Part III Calculations
  l9 = computed(() => 
    (this.form.get('l4')?.value || 0) + 
    (this.form.get('l5')?.value || 0) + 
    (this.form.get('l6')?.value || 0) + 
    (this.form.get('l7')?.value || 0) + 
    (this.form.get('l8')?.value || 0)
  );
  l10 = computed(() => this.l3() + this.l9());

  // Part IV Calculations
  l13 = computed(() => (this.form.get('l11')?.value || 0) - (this.form.get('l12')?.value || 0));
  l17 = computed(() => 
    this.l13() + 
    (this.form.get('l14')?.value || 0) + 
    (this.form.get('l15')?.value || 0) + 
    (this.form.get('l16')?.value || 0)
  );

  onSubmit() {
    console.log('Form 1041 Schedule G Submitted', this.form.value);
  }
}
