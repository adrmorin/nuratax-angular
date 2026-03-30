import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeroSliderComponent } from '../hero-slider/hero-slider.component';
import { ModalService } from '../../../services/modal.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [RouterLink, CommonModule, HeroSliderComponent, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HomeHeroComponent implements OnInit, OnDestroy {
  public modalService = inject(ModalService);
  public authService = inject(AuthService);
  private translate = inject(TranslateService);

  protected currentMessageIndex = signal(0);
  private intervalId?: ReturnType<typeof setInterval>;
  private langSub?: { unsubscribe(): void };

  protected messages: string[] = [];

  ngOnInit() {
    this.startCarousel();
    this.loadMessages();
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.loadMessages();
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.langSub?.unsubscribe();
  }

  private loadMessages() {
    this.translate.get('HOME.MESSAGES').subscribe((msgs: string[]) => {
      this.messages = msgs;
    });
  }

  private startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentMessageIndex.update(idx => (idx + 1) % this.messages.length);
    }, 5000);
  }
}
