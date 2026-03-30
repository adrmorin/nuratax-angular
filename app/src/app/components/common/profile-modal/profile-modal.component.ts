import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-profile-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './profile-modal.component.html',
    styleUrl: './profile-modal.component.css'
})
export class ProfileModalComponent {
    modalService = inject(ModalService);
    authService = inject(AuthService);

    constructor() {
        effect(() => {
            if (this.modalService.isProfileVisible() && !this.authService.currentUser()) {
                this.modalService.closeProfile();
            }
        });
    }

    get user() {
        return this.authService.currentUser();
    }

    get userInitials(): string {
        const current = this.user;
        if (!current) return 'U';

        // Si no hay apellido, sacamos las dos primeras letras del nombre
        if (current.firstName && !current.lastName) {
            return current.firstName.substring(0, 2).toUpperCase();
        }

        // Si hay nombre y apellido
        if (current.firstName && current.lastName) {
            return `${current.firstName[0]}${current.lastName[0]}`.toUpperCase();
        }

        return 'U';
    }

    closeModal(event: Event) {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.modalService.closeProfile();
        }
    }

    openValidation() {
        this.modalService.openValidate();
    }
}
