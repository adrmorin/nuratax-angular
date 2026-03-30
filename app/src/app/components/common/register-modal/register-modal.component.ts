import { Component, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../services/modal.service';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RegisterResponse, User } from '../../../models/user-interface';

@Component({
    selector: 'app-register-modal',
    standalone: true,
    imports: [FormsModule, CommonModule, MessageComponent, TranslateModule],
    templateUrl: './register-modal.component.html',
    styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent {
    public modalService = inject(ModalService);
    private userService = inject(UserService);
    private translate = inject(TranslateService);

    email = '';
    firstName = '';
    lastName = '';
    phone = '';
    password = '';
    confirmPassword = '';
    loading = false;
    error = '';
    success = false;
    successMessage = '';

    showPassword = false;

    hasUpperCase = false;
    hasSpecialChar = false;
    hasNumber = false;
    minLength = false;
    passwordsMatch = false;

    togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
    }

    validatePassword() {
        this.hasUpperCase = /[A-Z]/.test(this.password);
        this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.password);
        this.hasNumber = /\d/.test(this.password);
        this.minLength = this.password.length >= 8;

        this.checkPasswordsMatch();
    }

    checkPasswordsMatch() {
        this.passwordsMatch = this.password === this.confirmPassword && this.password !== '';
    }

    get isPasswordValid(): boolean {
        return this.hasUpperCase && this.hasSpecialChar && this.hasNumber && this.minLength;
    }

    onSubmit() {
        this.validatePassword();

        if (!this.email || !this.firstName || !this.lastName || !this.phone || !this.password || !this.confirmPassword) {
            this.error = this.translate.instant('AUTH.ERROR_REQUIRED_FIELDS');
            return;
        }

        if (!this.isPasswordValid) {
            this.error = this.translate.instant('AUTH.ERROR_PASSWORD_REQUIREMENTS');
            return;
        }

        if (!this.passwordsMatch) {
            this.error = this.translate.instant('AUTH.ERROR_PASSWORD_MISMATCH');
            return;
        }

        this.loading = true;
        this.error = '';
        this.success = false;
        this.successMessage = '';

        const registrationData = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone,
            password: this.password,
            username: this.email
        };

        this.userService.registerUser(registrationData).subscribe({
            next: (response) => {
                this.loading = false;
                this.success = true;
                this.successMessage = this.extractBackendMessage(response, 'AUTH.REGISTER_SUCCESS');
                this.clearFormFields();
            },
            error: (err) => {
                this.loading = false;
                this.error = this.extractBackendMessage(err?.error ?? err, 'AUTH.ERROR_SERVER');
            }
        });
    }

    openLoginAfterRegister() {
        this.modalService.closeRegister();
        this.resetForm();
        this.modalService.openLogin();
    }

    resetForm() {
        this.clearFormFields();
        this.success = false;
        this.successMessage = '';
        this.error = '';
    }

    private clearFormFields() {
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.phone = '';
        this.password = '';
        this.confirmPassword = '';
        this.showPassword = false;
        this.hasUpperCase = false;
        this.hasSpecialChar = false;
        this.hasNumber = false;
        this.minLength = false;
        this.passwordsMatch = false;
    }

    private extractBackendMessage(payload: unknown, fallbackKey: string): string {
        if (typeof payload === 'string' && payload.trim()) {
            return payload;
        }

        if (payload && typeof payload === 'object') {
            const candidate = payload as RegisterResponse & User & { error?: { message?: string } };

            if (typeof candidate.message === 'string' && candidate.message.trim()) {
                return candidate.message;
            }

            if (candidate.error && typeof candidate.error.message === 'string' && candidate.error.message.trim()) {
                return candidate.error.message;
            }
        }

        return this.translate.instant(fallbackKey);
    }
}
