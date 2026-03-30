import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  activeAccordion = signal<number | null>(null);

  accordionItems = new Array(10);

  toggleAccordion(index: number): void {
    this.activeAccordion.set(this.activeAccordion() === index ? null : index);
  }
}
