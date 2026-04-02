import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { ModalService } from '../../../services/modal.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, CommonModule, TranslateModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    private authService = inject(AuthService);
    private router = inject(Router);
    private location = inject(Location);
    public modalService = inject(ModalService);
    @Input() isCollapsed = true;
    @Input() portalType: 'agent' | 'free' | 'premium' | 'vip' = 'agent';
    @Output() isCollapsedChange = new EventEmitter<boolean>();

    toggleSidebar(): void {
        this.isCollapsed = !this.isCollapsed;
        this.isCollapsedChange.emit(this.isCollapsed);
    }

    get hasAuthenticatedUser(): boolean {
        return !!this.authService.currentUser();
    }

    goBack(): void {
        this.location.back();
    }

    openProfile(): void {
        if (!this.hasAuthenticatedUser) {
            this.router.navigate(['/']);
            return;
        }
        this.modalService.openProfile();
    }

    logout(event: Event): void {
        event.preventDefault();
        this.authService.logout();
        this.router.navigate(['/']).then(() => {
            this.modalService.openLogin();
        });
    }

    get portalLabelKey(): string {
        if (this.portalType === 'free') return 'COMMON.FREE';
        if (this.portalType === 'premium') return 'COMMON.PREMIUM';
        if (this.portalType === 'vip') return 'COMMON.VIP';
        return 'COMMON.AGENT';
    }
}
