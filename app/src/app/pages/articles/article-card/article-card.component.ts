import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-article-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent {
  @Input() imageUrl: string = '';
  @Input() categoryLabel: string = '';
  @Input() title: string = '';
  @Input() date: string = '';
  @Input() readTime: string = '';
  @Input() content: string = '';
}
