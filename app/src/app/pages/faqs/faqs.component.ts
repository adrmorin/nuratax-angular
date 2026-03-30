import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {
  constructor(private renderer: Renderer2) {}

  onFaqClick(event: Event) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const isOpen = target.classList.contains('open');
    if (isOpen) {
      this.renderer.removeClass(target, 'open');
    } else {
      this.renderer.addClass(target, 'open');
    }
  }
}
