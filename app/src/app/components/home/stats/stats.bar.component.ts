import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './stats.bar.component.html',
  styleUrl: './stats.bar.component.css'
})
export class StatsBarComponent { }
