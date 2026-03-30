import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private authService = inject(AuthService);
    private loginVisible = signal(false);

    private plansVisible = signal(false);

    // Getter para el estado del modal de login
    get isLoginVisible() {
        return this.loginVisible.asReadonly();
    }

    // Getter para el estado del modal de planes
    get isPlansVisible() {
        return this.plansVisible.asReadonly();
    }

    // Abrir el modal de login
    openLogin() {
        this.loginVisible.set(true);
        this.plansVisible.set(false); // Close plans if open
        this.registerVisible.set(false); // Close register if open
        document.body.style.overflow = 'hidden'; // Bloquear scroll
    }

    // Cerrar el modal de login
    closeLogin() {
        this.loginVisible.set(false);
        if (!this.plansVisible()) {
            document.body.style.overflow = 'auto'; // Habilitar scroll only if no other modal is open
        }
    }

    // Alternar el modal de login
    toggleLogin() {
        if (this.loginVisible()) {
            this.closeLogin();
        } else {
            this.openLogin();
        }
    }

    // === PLANS MODAL ===

    openPlans() {
        this.plansVisible.set(true);
        this.loginVisible.set(false); // Close login if open
        this.registerVisible.set(false); // Close register if open
        document.body.style.overflow = 'hidden';
    }

    closePlans() {
        this.plansVisible.set(false);
        if (!this.loginVisible()) {
            document.body.style.overflow = 'auto';
        }
    }

    togglePlans() {
        if (this.plansVisible()) {
            this.closePlans();
        } else {
            this.openPlans();
        }
    }

    // === REGISTER MODAL ===
    private registerVisible = signal(false);

    get isRegisterVisible() {
        return this.registerVisible.asReadonly();
    }

    openRegister() {
        this.registerVisible.set(true);
        this.loginVisible.set(false);
        this.plansVisible.set(false);
        document.body.style.overflow = 'hidden';
    }

    closeRegister() {
        this.registerVisible.set(false);
        if (!this.loginVisible() && !this.plansVisible()) {
            document.body.style.overflow = 'auto';
        }
    }

    toggleRegister() {
        if (this.registerVisible()) {
            this.closeRegister();
        } else {
            this.openRegister();
        }
    }

    // === VALIDATE MODAL ===
    private validateVisible = signal(false);

    get isValidateVisible() {
        return this.validateVisible.asReadonly();
    }

    openValidate() {
        this.validateVisible.set(true);
        this.loginVisible.set(false);
        this.plansVisible.set(false);
        this.registerVisible.set(false);
        document.body.style.overflow = 'hidden';
    }

    closeValidate() {
        this.validateVisible.set(false);
        if (!this.loginVisible() && !this.plansVisible() && !this.registerVisible()) {
            document.body.style.overflow = 'auto';
        }
    }

    // === PROFILE MODAL ===
    private profileVisible = signal(false);

    get isProfileVisible() {
        return this.profileVisible.asReadonly();
    }

    openProfile() {
        if (!this.authService.currentUser()) {
            this.profileVisible.set(false);
            return;
        }
        this.profileVisible.set(true);
        this.loginVisible.set(false);
        this.plansVisible.set(false);
        this.registerVisible.set(false);
        this.validateVisible.set(false);
        document.body.style.overflow = 'hidden';
    }

    closeProfile() {
        this.profileVisible.set(false);
        if (!this.loginVisible() && !this.plansVisible() && !this.registerVisible() && !this.validateVisible()) {
            document.body.style.overflow = 'auto';
        }
    }

    toggleProfile() {
        if (this.profileVisible()) {
            this.closeProfile();
        } else {
            this.openProfile();
        }
    }
}
