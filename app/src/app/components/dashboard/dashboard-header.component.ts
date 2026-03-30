import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { UserProfileMenuComponent } from '../common/user-profile-menu/user-profile-menu.component';
import { LanguageService } from '../../services/language.service';

interface ClientConfig {
    title: string;
    subtitle: string;
    brandName: string;
    brandSubtitle: string;
    accentColor: string;
}

@Component({
    selector: 'app-dashboard-header',
    standalone: true,
    imports: [CommonModule, TranslateModule, UserProfileMenuComponent],
    templateUrl: './dashboard-header.component.html',
    styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent {
    private languageService = inject(LanguageService);

    get currentLang(): string {
        return this.languageService.currentLanguage;
    }

    switchLanguage(lang: string) {
        this.languageService.setLanguage(lang);
    }

    @Input() showLangSwitcher = false;
    @Input() clientType: 'free' | 'premium' | 'vip' | 'agent' = 'agent';
    @Input() title?: string;
    @Input() subtitle?: string;
    @Input() showLogo = true;
    @Input() userAvatar?: string;
    public auth = inject(AuthService);
    public modalService = inject(ModalService);

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
        }, 500); // 500ms delay
    }

    logout() {
        this.auth.logout();
    }

    get userName(): string {
        const user = this.auth.currentUser();
        if (!user) return '';
        if (user.firstName) {
            return `${user.firstName} ${user.lastName || ''}`.trim();
        }
        if (user.email) return user.email;
        return user.username || '';
    }

    get user() {
        return this.auth.currentUser();
    }

    get hasAuthenticatedUser(): boolean {
        return !!this.user;
    }

    openValidation() {
        this.isProfileMenuOpen = false;
        this.modalService.openValidate();
    }

    private clientConfigs: Record<string, ClientConfig> = {
        free: {
            title: 'DASHBOARD.HEADER.TITLE',
            subtitle: 'DASHBOARD.HEADER.SUBTITLE_FREE',
            brandName: 'Neuraltax',
            brandSubtitle: 'COMMON.FREE',
            accentColor: '#9ca3af'
        },
        premium: {
            title: 'DASHBOARD.HEADER.TITLE',
            subtitle: 'DASHBOARD.HEADER.SUBTITLE_PREMIUM',
            brandName: 'Neuraltax',
            brandSubtitle: 'COMMON.PREMIUM',
            accentColor: '#688071'
        },
        vip: {
            title: 'DASHBOARD.HEADER.TITLE',
            subtitle: 'DASHBOARD.HEADER.SUBTITLE_VIP',
            brandName: 'Neuraltax',
            brandSubtitle: 'COMMON.VIP',
            accentColor: '#fbbf24'
        },
        agent: {
            title: 'DASHBOARD.HEADER.TITLE_AGENT',
            subtitle: 'DASHBOARD.HEADER.SUBTITLE_AGENT',
            brandName: 'Neuraltax',
            brandSubtitle: 'COMMON.AGENT',
            accentColor: '#688071'
        }
    };

    get config(): ClientConfig {
        return this.clientConfigs[this.clientType];
    }

    get displayTitle(): string {
        return this.title || this.config.title;
    }

    get displaySubtitle(): string {
        return this.subtitle || this.config.subtitle;
    }

    get userInitials(): string {
        if (!this.userName) return '';
        return this.userName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}
