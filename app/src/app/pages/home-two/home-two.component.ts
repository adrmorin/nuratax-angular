import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { HomeTwoSlide7Component } from "./slides/slide-7/slide-7.component";
import { HomeTwoSlide1Component } from "./slides/slide-1/slide-1.component";
import { HomeTwoSlide2Component } from "./slides/slide-2/slide-2.component";
import { HomeTwoSlide3Component } from "./slides/slide-3/slide-3.component";
import { HomeTwoSlide4Component } from "./slides/slide-4/slide-4.component";
import { HomeTwoSlide5Component } from "./slides/slide-5/slide-5.component";
import { HomeTwoSlide6Component } from "./slides/slide-6/slide-6.component";
import { PlansComponent } from "../plans/plans.component";
import { ArticlesComponent } from "../articles/articles.component";
import { ReviewsComponent } from "../reviews/reviews.component";
import { FaqsComponent } from "../faqs/faqs.component";

declare const $: any;

@Component({
  selector: 'app-home-two',
  templateUrl: './home-two.component.html',
  styleUrls: ['./home-two.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [HomeTwoSlide7Component, HomeTwoSlide1Component, HomeTwoSlide2Component, HomeTwoSlide3Component, HomeTwoSlide4Component, HomeTwoSlide5Component, HomeTwoSlide6Component, PlansComponent, ArticlesComponent, ReviewsComponent, FaqsComponent]
})
export class HomeTwoComponent implements OnInit, AfterViewInit {

  slides = Array(7).fill(null);

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (typeof $ !== 'undefined' && $('.banner-content-slides').owlCarousel) {
      $('.banner-content-slides').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        dots: false,
        nav: false,
        // navText: [
        //   '<i class="bx bx-chevron-left"></i>',
        //   '<i class="bx bx-chevron-right"></i>'
        // ],
        smartSpeed: 600
      });
    }
  }

  // Fallback to avoid template errors from landing FAQ frame
  onFaqClick(event: Event) {
    const target = event?.currentTarget as HTMLElement | null;
    if (!target) return;
    const answer = target.querySelector('.faq-answer') as HTMLElement | null;
    if (!answer) return;
    const isOpen = target.classList.contains('open');
    if (isOpen) {
      target.classList.remove('open');
      answer.style.display = 'none';
    } else {
      target.classList.add('open');
      answer.style.display = 'block';
    }
  }

}
