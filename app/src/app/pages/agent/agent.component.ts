import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from '../../components/dashboard/dashboard-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-agent',
    standalone: true,
    imports: [CommonModule, DashboardHeaderComponent, TranslateModule],
    templateUrl: './agent.component.html',
    styleUrl: './agent.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentComponent {
    stats = [
        { title: 'DASHBOARD.AGENT.STATS.TOTAL_CLIENTS', value: '87', change: '+12%', icon: 'group', color: '255, 36, 0' },
        { title: 'DASHBOARD.AGENT.STATS.REVENUE', value: '$24,580', change: '+8%', icon: 'payments', color: '255, 36, 0' },
        { title: 'DASHBOARD.AGENT.STATS.COMPLETED', value: '43', change: '+15%', icon: 'task_alt', color: '255, 36, 0' },
        { title: 'DASHBOARD.AGENT.STATS.SATISFACTION', value: '98%', change: '+2%', icon: 'star', color: '255, 36, 0' }
    ];

    upcomingTasks = [
        { title: 'DASHBOARD.AGENT.TASKS.W2_REVIEW', dueDate: 'DASHBOARD.AGENT.TASKS.DUE_TODAY', icon: 'description', priority: 'urgent' },
        { title: 'DASHBOARD.AGENT.TASKS.DECLARATION_COMPLETE', dueDate: 'DASHBOARD.AGENT.TASKS.DUE_TOMORROW', icon: 'task', priority: 'high' },
        { title: 'DASHBOARD.AGENT.TASKS.NEW_CLIENT_CALL', dueDate: 'DASHBOARD.AGENT.TASKS.DUE_2_DAYS', icon: 'call', priority: 'normal' }
    ];

    recentActivity = [
        { action: 'DASHBOARD.AGENT.ACTIVITY.NEW_CLIENT', time: 'DASHBOARD.AGENT.ACTIVITY.TIME_2H', icon: 'person_add' },
        { action: 'DASHBOARD.AGENT.ACTIVITY.IRS_SENT', time: 'DASHBOARD.AGENT.ACTIVITY.TIME_4H', icon: 'send' },
        { action: 'DASHBOARD.AGENT.ACTIVITY.DOCS_RECEIVED', time: 'DASHBOARD.AGENT.ACTIVITY.TIME_6H', icon: 'upload_file' }
    ];
}
