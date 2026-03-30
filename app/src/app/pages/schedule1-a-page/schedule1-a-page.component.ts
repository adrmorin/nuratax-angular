import { Component } from '@angular/core';
import { Fs10401AComponent } from '../../components/forms/fs10401-a/fs10401-a.component';

@Component({
  selector: 'app-schedule1-a-page',
  standalone: true,
  imports: [Fs10401AComponent],
  template: `
    <div class="page-container">
      <app-fs10401-a></app-fs10401-a>
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
export class Schedule1APageComponent { }
