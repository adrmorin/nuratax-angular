import { Component, OnDestroy, OnInit, inject, PLATFORM_ID, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { fromEvent, Subscription, timer } from 'rxjs';
import { map, pairwise, share, throttleTime } from 'rxjs/operators';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserProfileMenuComponent } from '../user-profile-menu/user-profile-menu.component';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule, UserProfileMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() minimal = false;
  @Input() isLanding = false;
  isHidden = false;
  private scrollSub: Subscription | null = null;
  private inactivitySub: Subscription | null = null;
  private readonly HIDE_DELAY = 180000; // 3 minutes in ms
  private platformId = inject(PLATFORM_ID);
  public modalService = inject(ModalService);
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private readonly DEFAULT_LANG = 'en';
  private readonly DEFAULT_USER_KEY = 'AUTH.USER';
  private readonly DEFAULT_INITIAL = 'U';
  private readonly MENU_CLOSE_DELAY = 500;
  private readonly SCROLL_THROTTLE = 10;
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  get currentLang(): string {
    return this.languageService.currentLanguage || this.translate.defaultLang || this.DEFAULT_LANG;
  }

  getUserDisplayName(user: { firstName?: string; lastName?: string; email?: string; username?: string }): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    if (user.username) {
      return user.username.includes('@') ? user.username.split('@')[0] : user.username;
    }
    return this.translate.instant(this.DEFAULT_USER_KEY);
  }

  get userAvatar(): string | null {
    // In future: return user.profilePictureUrl
    return null as string | null;
  }

  getUserInitials(user: { firstName?: string; lastName?: string; email?: string; username?: string }): string {
    const name = this.getUserDisplayName(user);
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (name.length > 0) {
      return name.substring(0, 2).toUpperCase();
    }
    return this.DEFAULT_INITIAL;
  }

  isProfileMenuOpen = false;
  private menuTimeout: ReturnType<typeof setTimeout> | null = null;

  toggleProfileMenu() {
    if (this.menuTimeout) clearTimeout(this.menuTimeout);
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  cancelMenuClose() {
    if (this.menuTimeout) clearTimeout(this.menuTimeout);
  }

  closeProfileMenu() {
    if (this.menuTimeout) clearTimeout(this.menuTimeout);
    this.menuTimeout = setTimeout(() => {
      this.isProfileMenuOpen = false;
    }, this.MENU_CLOSE_DELAY); // 500ms delay
  }

  logout(): void {
    this.authService.logout();
    console.log('👋 Sesión cerrada');
  }

  switchLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startInactivityTimer();
      this.initScrollListener();
    }
  }

  ngOnDestroy() {
    this.scrollSub?.unsubscribe();
    this.inactivitySub?.unsubscribe();
  }

  private startInactivityTimer() {
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    this.inactivitySub?.unsubscribe();
    // Start timer to hide header after HIDE_DELAY
    this.inactivitySub = timer(this.HIDE_DELAY).subscribe(() => {
      this.isHidden = true;
    });
  }

  private initScrollListener() {
    const scroll$ = fromEvent(window, 'scroll').pipe(
      throttleTime(this.SCROLL_THROTTLE), // Reduced throttling for smoother feel
      map(() => window.scrollY),
      pairwise(),
      share()
    );

    this.scrollSub = scroll$.subscribe(([y1, y2]) => {
      // If scrolling UP (y2 < y1) and header is hidden, show it
      if (y2 < y1 && this.isHidden) {
        this.isHidden = false;
        this.resetInactivityTimer(); // Restart the cycle
      }
      // Note: We deliberately DO NOT hide on scroll down based on user request.
      // The requirement is: Hide after 3 mins -> Show when scrolling up with mouse -> Repeat cycle.

      // However, any interaction usually resets inactivity. 
      // User said "vuelve al mismo ciclo de los tres minutos".
      // So if I scroll up and it shows, the timer resets. 
    });
  }
}

