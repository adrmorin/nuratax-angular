import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { User } from '../../../models/user-interface';
import { AuthService } from '../../../services/auth.service';
import { ModalService } from '../../../services/modal.service';

@Component({
    selector: 'app-user-profile-menu',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './user-profile-menu.component.html',
    styleUrl: './user-profile-menu.component.css'
})
export class UserProfileMenuComponent {
    @Input() user!: User | null;
    @Output() closeMenu = new EventEmitter<void>();
    @Output() cancelCloseMenu = new EventEmitter<void>();

    public authService = inject(AuthService);
    public modalService = inject(ModalService);
    private translate = inject(TranslateService);

    get displayName(): string {
<<<<<<< HEAD
        if (!this.user) return this.translate.instant('AUTH.USER');
=======
        if (!this.user) return '';
>>>>>>> b010ee2287c0f3f281777bc740b543e4d3da4330
        if (this.user.firstName && this.user.lastName) {
            return `${this.user.firstName} ${this.user.lastName}`.trim();
        }
        if (this.user.firstName) {
            return this.user.firstName;
        }
        if (this.user.email) {
            return this.user.email.split('@')[0];
        }
<<<<<<< HEAD
        return this.translate.instant('AUTH.USER');
=======
        if (this.user.username) {
            return this.user.username.includes('@') ? this.user.username.split('@')[0] : this.user.username;
        }
        return '';
>>>>>>> b010ee2287c0f3f281777bc740b543e4d3da4330
    }

    get userInitials(): string {
        return this.displayName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    get userRoleCode(): string {
        if (!this.user || !this.user.roles || this.user.roles.length === 0) return 'PROFILE.MEMBER';
        if (this.user.roles.includes('ROLE_VIP')) return 'PROFILE.VIP_MEMBER';
        if (this.user.roles.includes('ROLE_AGENT')) return 'PROFILE.AGENT';
        if (this.user.roles.includes('ROLE_PREMIUM')) return 'PROFILE.PREMIUM_MEMBER';
        return 'PROFILE.FREE_MEMBER';
    }

    get displayEmail(): string {
        return this.user?.email || this.user?.username || '';
    }

    get displayPhone(): string {
        return this.user?.phone || 'PROFILE.NOT_REGISTERED';
    }

    get displayAddress(): string {
        return this.user?.address || 'PROFILE.PENDING_UPDATE';
    }

    openProfile() {
        if (!this.user) return;
        this.closeMenu.emit();
        this.modalService.openProfile();
    }

    openValidation() {
        if (!this.user) return;
        this.closeMenu.emit();
        this.modalService.openValidate();
    }

    logout() {
        this.closeMenu.emit();
        this.authService.logout();
    }
}
