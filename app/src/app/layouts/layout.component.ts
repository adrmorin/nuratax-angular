import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from '../components/common/header/header.component';
import { FooterComponent } from '../components/common/footer/footer.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ChatbotComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private router = inject(Router);

  private isLandingUrl(url: string): boolean {
    const normalizedUrl = url.split('?')[0].split('#')[0];
    return normalizedUrl === '/' || normalizedUrl === '';
  }

  // Track current URL to determine if we are on the landing page
  isLandingPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event) => {
        const navEvent = event as NavigationEnd;
        return this.isLandingUrl(navEvent.urlAfterRedirects);
      })
    ),
    { initialValue: this.isLandingUrl(this.router.url) }
  );
}
