import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { LoginComponent } from './pages/login/login.component';
import { PlansModalComponent } from './components/common/plans-modal/plans-modal.component';
import { RegisterModalComponent } from './components/common/register-modal/register-modal.component';
import { ProfileModalComponent } from './components/common/profile-modal/profile-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, PlansModalComponent, RegisterModalComponent, ProfileModalComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App implements OnInit {
  private auth = inject(AuthService);
  public modalService = inject(ModalService);
  private translate = inject(TranslateService);
  private titleService = inject(Title);
  private languageService = inject(LanguageService);

  ngOnInit() {
    this.auth.checkLoginStatus();
    this.auth.isLoggedIn.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.modalService.closeProfile();
      }
    });

    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.languageService.initialize();

    // Update document title dynamically based on language
    this.translate.onLangChange.subscribe(() => {
      this.translate.get('PAGE_TITLE').subscribe((res: string) => {
        this.titleService.setTitle(res);
      });
    });

    this.translate.get('PAGE_TITLE').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });
  }
}
