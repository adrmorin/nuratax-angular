import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardHeaderComponent } from '../../components/dashboard/dashboard-header.component';
import { TaxDataService } from '../../services/tax-data.service';
import { Form1040PrincipalComponent } from '../../components/forms/form1040-principal/form1040-principal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-free-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, DashboardHeaderComponent, Form1040PrincipalComponent, TranslateModule],
    templateUrl: './free-dashboard.component.html',
    styleUrl: './free-dashboard.component.css'
})
export class FreeDashboardComponent {
    // Re-saved to trigger IDE sync
    private taxDataService = inject(TaxDataService);
    private translate = inject(TranslateService);
    private authService = inject(AuthService);
    private modalService = inject(ModalService);
    isBusinessOwner = this.taxDataService.isBusinessOwner();
    showForm1040 = false;

    scrollToForm() {
        const user = this.authService.currentUser();
        if (user && !user.isValidated) {
            this.modalService.openValidate();
            return;
        }

        this.showForm1040 = true;
        // Wait for Angular to render the component before scrolling
        setTimeout(() => {
            const element = document.getElementById('form1040Section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    stats = [
        {
            label: 'DASHBOARD.FREE.STATS.UPLOADED_DOCS',
            value: '2',
            total: '/10',
            icon: 'description',
            status: '2/10'
        },
        {
            label: 'DASHBOARD.FREE.STATS.COMPLETED_FORMS',
            value: '0',
            total: '/1',
            icon: 'task_alt',
            status: 'DASHBOARD.FREE.STATS.IN_PROGRESS'
        },
        {
            label: 'DASHBOARD.FREE.STATS.EST_REFUND',
            value: '$0',
            total: '',
            icon: 'payments',
            status: 'DASHBOARD.FREE.STATS.ESTIMATED'
        }
    ];

    uploadSteps = [
        { text: 'DASHBOARD.FREE.STEPS.W2', completed: true },
        { text: 'DASHBOARD.FREE.STEPS.INTEREST', completed: true },
        { text: 'DASHBOARD.FREE.STEPS.RECEIPTS', completed: false, premium: true }
    ];

    declarationSteps = [
        { text: 'DASHBOARD.FREE.STEPS.FORM1040', completed: true },
        { text: 'DASHBOARD.FREE.STEPS.DEDUCTION', completed: true },
        { text: 'DASHBOARD.FREE.STEPS.SCHEDULE_C', completed: false, premium: !this.isBusinessOwner }
    ];


}
