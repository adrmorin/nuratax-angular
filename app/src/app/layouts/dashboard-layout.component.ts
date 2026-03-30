import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, Event } from '@angular/router';
import { SidebarComponent } from '../components/common/sidebar/sidebar.component';
import { ChatbotComponent } from '../components/chatbot/chatbot.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { ValidateModalComponent } from '../components/common/validate-modal/validate-modal.component';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ChatbotComponent, CommonModule, ValidateModalComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  isCollapsed = signal(true);
  currentUrl = signal('');
  portalType = computed(() => {
    const url = this.currentUrl();
    if (url.includes('premium-dashboard')) return 'premium';
    return url.includes('free-dashboard') ? 'free' : 'agent';
  });

  private router = inject(Router);
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

  constructor() {
    // Set initial URL
    this.currentUrl.set(this.router.url);

    // Listen to route changes
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.url);
      this.checkValidation();
    });

    // Initial check
    this.checkValidation();
  }

  checkValidation() {
    // Disabled per user request (verification bypass)
    /*
    const user = this.authService.currentUser();
    if (user && !user.isValidated) {
        this.modalService.openValidate();
    }
    */
  }
}
