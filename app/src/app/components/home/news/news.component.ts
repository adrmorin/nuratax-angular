import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-latest-news',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class LatestNewsComponent {
  private blogService = inject(BlogService);
  articles = this.blogService.getArticles();

  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLElement>;

  scrollLeft() {
    if (this.carouselTrack) {
      const track = this.carouselTrack.nativeElement;
      // Scroll by the width of one card + gap (~300px + 24px)
      track.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.carouselTrack) {
      const track = this.carouselTrack.nativeElement;
      track.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }
}
