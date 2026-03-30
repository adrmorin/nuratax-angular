import { Component, OnDestroy, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/slider/slide-1.png',
    'assets/slider/slide-2.png',
    'assets/slider/slide-3.png',
    'assets/slider/slide-4.png',
    'assets/slider/slide-5.png',
    'assets/slider/slide-6.png',
    'assets/slider/slide-7.png',
    'assets/slider/slide-8.png'
  ];
  currentImageIndex = 0;
  private sliderSub: Subscription | null = null;
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startSlider();
    }
  }

  ngOnDestroy() {
    this.sliderSub?.unsubscribe();
  }

  startSlider() {
    this.sliderSub = timer(0, 3000).subscribe(() => {
      // Logic for next slide
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.cdr.detectChanges(); // Force update
    });
  }
}
