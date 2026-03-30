import { Component } from '@angular/core';
import { F1040s2Component } from '../../components/forms/f1040s2/f1040s2.component';

@Component({
    selector: 'app-schedule2-page',
    standalone: true,
    imports: [F1040s2Component],
    template: `
    <div class="page-container">
      <app-f1040s2></app-f1040s2>
    </div>
  `,
    styles: [`
    .page-container {
      padding: 20px;
      background-color: #f4f4f7;
      min-height: 100vh;
    }
  `]
})
export class Schedule2PageComponent { }
