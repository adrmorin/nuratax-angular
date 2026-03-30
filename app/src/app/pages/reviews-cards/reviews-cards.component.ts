import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-cards.component.html',
  styleUrls: ['./reviews-cards.component.scss']
})
export class ReviewsCardsComponent {
  @Input() valoracion = 0; // 0–5
  @Input() contenido = '';
  @Input() usuario = '';
  @Input() avatarUrl: string | null = null; // ruta de imagen opcional
  @Input() puesto: string | null = null;    // rol/puesto opcional

  get stars(): number[] {
    const capped = Math.max(0, Math.min(5, Math.round(this.valoracion)));
    return Array.from({ length: 5 }, (_, i) => (i < capped ? 1 : 0));
  }
}
