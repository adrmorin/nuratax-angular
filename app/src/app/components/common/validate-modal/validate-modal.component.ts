import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { ModalService } from '../../../services/modal.service';
import { AuthService } from '../../../services/auth.service';
import { DocumentAnalysisService } from '../../../services/document-analysis.service';
import { NeuralSwal } from '../../../services/neuraltax-swal';

@Component({
    selector: 'app-validate-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './validate-modal.component.html',
    styleUrls: ['./validate-modal.component.css']
})
export class ValidateModalComponent {
    modalService = inject(ModalService);
    authService = inject(AuthService);
    docService = inject(DocumentAnalysisService);
    translate = inject(TranslateService);

    dniFile = signal<File | null>(null);
    w2File = signal<File | null>(null);
    ssnFile = signal<File | null>(null);

    isSubmitting = signal(false);

    onFileSelected(event: Event, type: 'dni' | 'w2' | 'ssn') {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (type === 'dni') this.dniFile.set(file);
            if (type === 'w2') this.w2File.set(file);
            if (type === 'ssn') this.ssnFile.set(file);
        }
    }

    private buildSessionKey(): string {
        const currentUser = this.authService.currentUser();
        if (currentUser?.id) {
            return `validation_${currentUser.id}`;
        }

        return `validation_${Date.now()}`;
    }

    async submitValidation() {
        if (!this.dniFile() || !this.w2File() || !this.ssnFile()) {
            await NeuralSwal.fire({
                icon: 'warning',
                title: this.translate.instant('VALIDATION.ERROR_TITLE'),
                text: this.translate.instant('VALIDATION.ERROR_MISSING'),
                confirmButtonText: this.translate.instant('COMMON.CLOSE')
            });
            return;
        }

        this.isSubmitting.set(true);

        try {
            const files = [this.dniFile()!, this.w2File()!, this.ssnFile()!];
            const sessionKey = this.buildSessionKey();
            const response = await lastValueFrom(this.docService.analyzeDocuments(files, sessionKey));

            console.log('[ValidateModal] analyzeDocuments result:', response);

            if (response?.status === 'ERROR' || response?.success === false) {
                throw new Error(response.message || this.translate.instant('VALIDATION.ERROR_GENERIC'));
            }

            const currentUser = this.authService.currentUser();
            if (currentUser) {
                this.authService.currentUser.set({
                    ...currentUser,
                    enabled: true,
                    identityVerified: true,
                    identityVerifiedAt: new Date().toISOString(),
                    isValidated: true
                });
            }

            this.modalService.closeValidate();
            await NeuralSwal.fire({
                icon: 'success',
                title: this.translate.instant('VALIDATION.SUCCESS_TITLE'),
                text: response?.message || this.translate.instant('VALIDATION.SUCCESS_MESSAGE'),
                confirmButtonText: this.translate.instant('COMMON.CLOSE')
            });
        } catch (error) {
            console.error('Validation error:', error);
            const message = error instanceof Error && error.message
                ? error.message
                : this.translate.instant('VALIDATION.ERROR_GENERIC');

            await NeuralSwal.fire({
                icon: 'error',
                title: this.translate.instant('VALIDATION.ERROR_TITLE'),
                text: message,
                confirmButtonText: this.translate.instant('COMMON.CLOSE')
            });
        } finally {
            this.isSubmitting.set(false);
        }
    }
}
