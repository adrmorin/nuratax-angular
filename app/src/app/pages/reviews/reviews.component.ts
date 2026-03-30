import { Component } from '@angular/core';
import { ReviewsCardsComponent } from '../reviews-cards/reviews-cards.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, ReviewsCardsComponent],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
    items = [
    { valoracion: 5, contenido: 'NeuralTax saved me time and stress. Highly recommended.', usuario: 'Alex P.', avatarUrl: 'assets/img/home-page/content1.png', puesto: 'Product Manager' },
    { valoracion: 4, contenido: 'Fast and accurate. The assistant guided me through everything.', usuario: 'María G.', avatarUrl: 'assets/img/home-page/content1.png', puesto: 'Analyst' },
    { valoracion: 5, contenido: 'Found deductions I didn’t even know about. Excellent.', usuario: 'Jorge R.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 5, contenido: 'NeuralTax saved me time and stress. Highly recommended.', usuario: 'Alex P.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 4, contenido: 'Fast and accurate. The assistant guided me through everything.', usuario: 'María G.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 5, contenido: 'Found deductions I didn’t even know about. Excellent.', usuario: 'Jorge R.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 5, contenido: 'Exceptional service and fast results.', usuario: 'Lucía S.', avatarUrl: 'assets/img/home-page/content1.png', puesto: 'Accountant' },
    { valoracion: 4, contenido: 'Good experience, everything was clear and guided.', usuario: 'Pedro T.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 5, contenido: 'They maximized my refund, very happy.', usuario: 'Elena V.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 4, contenido: 'I avoided mistakes and saved time this year.', usuario: 'Carlos M.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 5, contenido: 'The AI helps a lot, 100% recommended.', usuario: 'Nuria F.', avatarUrl: 'assets/img/home-page/content1.png' },
    { valoracion: 5, contenido: 'Simple and hassle-free process. Excellent.', usuario: 'Gabriel D.', avatarUrl: 'assets/img/home-page/content1.png' }
  ];
}
