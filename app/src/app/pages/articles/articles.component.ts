import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleCardComponent } from './article-card/article-card.component';

interface ArticleItem {
  imageUrl: string;
  categoryLabel: string;
  title: string;
  date: string;
  readTime: string;
  content: string;
}

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArticleCardComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent {
    articles: ArticleItem[] = [
        {
            imageUrl: '/assets/img/otros/imagewithfallback.png',
            categoryLabel: 'ARTICLES_PAGE.ARTICLES.0.CATEGORY',
            title: 'ARTICLES_PAGE.ARTICLES.0.TITLE',
            date: 'ARTICLES_PAGE.ARTICLES.0.DATE',
            readTime: 'ARTICLES_PAGE.ARTICLES.0.READ_TIME',
            content: 'ARTICLES_PAGE.ARTICLES.0.CONTENT'
        },
        {
            imageUrl: '/assets/img/otros/imagewithfallback-1.png',
            categoryLabel: 'ARTICLES_PAGE.ARTICLES.1.CATEGORY',
            title: 'ARTICLES_PAGE.ARTICLES.1.TITLE',
            date: 'ARTICLES_PAGE.ARTICLES.1.DATE',
            readTime: 'ARTICLES_PAGE.ARTICLES.1.READ_TIME',
            content: 'ARTICLES_PAGE.ARTICLES.1.CONTENT'
        },
        {
            imageUrl: '/assets/img/otros/imagewithfallback-2.png',
            categoryLabel: 'ARTICLES_PAGE.ARTICLES.2.CATEGORY',
            title: 'ARTICLES_PAGE.ARTICLES.2.TITLE',
            date: 'ARTICLES_PAGE.ARTICLES.2.DATE',
            readTime: 'ARTICLES_PAGE.ARTICLES.2.READ_TIME',
            content: 'ARTICLES_PAGE.ARTICLES.2.CONTENT'
        },
        {
            imageUrl: '/assets/img/otros/imagewithfallback-3.png',
            categoryLabel: 'ARTICLES_PAGE.ARTICLES.3.CATEGORY',
            title: 'ARTICLES_PAGE.ARTICLES.3.TITLE',
            date: 'ARTICLES_PAGE.ARTICLES.3.DATE',
            readTime: 'ARTICLES_PAGE.ARTICLES.3.READ_TIME',
            content: 'ARTICLES_PAGE.ARTICLES.3.CONTENT'
        }
    ];
}
