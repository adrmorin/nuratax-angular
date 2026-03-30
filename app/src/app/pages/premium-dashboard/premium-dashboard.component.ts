import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardHeaderComponent } from '../../components/dashboard/dashboard-header.component';
import { TaxDataService } from '../../services/tax-data.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-premium-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink, DashboardHeaderComponent, TranslateModule],
    templateUrl: './premium-dashboard.component.html',
    styleUrl: './premium-dashboard.component.css'
})
export class PremiumDashboardComponent {
    private taxDataService = inject(TaxDataService);

    premiumStats = [
        {
            label: 'DASHBOARD.PREMIUM.STATS.EFFICIENCY',
            value: '94%',
            icon: 'insights',
            trend: 'DASHBOARD.PREMIUM.STATS.TREND_OPTIMIZED',
            description: 'DASHBOARD.PREMIUM.STATS.EFFICIENCY_DESC'
        },
        {
            label: 'DASHBOARD.PREMIUM.STATS.SAVINGS',
            value: '$4,250',
            icon: 'savings',
            trend: 'DASHBOARD.PREMIUM.STATS.TREND_OPTIMIZED',
            description: 'DASHBOARD.PREMIUM.STATS.SAVINGS_DESC'
        },
        {
            label: 'DASHBOARD.PREMIUM.STATS.RISK',
            value: 'Bajo',
            icon: 'verified_user',
            trend: 'DASHBOARD.PREMIUM.STATS.TREND_CERTIFIED',
            description: 'DASHBOARD.PREMIUM.STATS.RISK_DESC'
        }
    ];

    aiModules = [
        {
            title: 'DASHBOARD.PREMIUM.AI.AUDITOR_TITLE',
            description: 'DASHBOARD.PREMIUM.AI.AUDITOR_DESC',
            icon: 'biotech',
            action: 'DASHBOARD.PREMIUM.AI.AUDITOR_ACTION'
        },
        {
            title: 'DASHBOARD.PREMIUM.AI.OPTIMIZER_TITLE',
            description: 'DASHBOARD.PREMIUM.AI.OPTIMIZER_DESC',
            icon: 'auto_awesome',
            action: 'DASHBOARD.PREMIUM.AI.OPTIMIZER_ACTION'
        },
        {
            title: 'DASHBOARD.PREMIUM.AI.STRATEGY_TITLE',
            description: 'DASHBOARD.PREMIUM.AI.STRATEGY_DESC',
            icon: 'area_chart',
            action: 'DASHBOARD.PREMIUM.AI.STRATEGY_ACTION'
        }
    ];

    priorityTasks = [
        { text: 'DASHBOARD.PREMIUM.PRIORITY.TASKS.SCHEDULE_C', status: 'completado' },
        { text: 'DASHBOARD.PREMIUM.PRIORITY.TASKS.ENERGY_CREDIT', status: 'pendiente' },
        { text: 'DASHBOARD.PREMIUM.PRIORITY.TASKS.EXPENSE_SYNC', status: 'pendiente' }
    ];
}
