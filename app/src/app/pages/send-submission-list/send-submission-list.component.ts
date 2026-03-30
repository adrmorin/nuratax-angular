import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IrsSubmission } from '../../interfaces/irs-submission.interface';
import { IrsSubmissionService } from '../../services/irs-submission.service';

@Component({
    selector: 'app-send-submission-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './send-submission-list.component.html',
    styleUrl: './send-submission-list.component.scss'
})
export class SendSubmissionListComponent implements OnInit {

    submissions: IrsSubmission[] = [];
    loading = false;
    error: string | null = null;

    constructor(private submissionService: IrsSubmissionService) { }

    ngOnInit(): void {
        this.loadSubmissions();
    }

    private loadSubmissions(): void {
        console.log('[IRS][Component] loadSubmissions() called');

        this.loading = true;
        this.error = null;

        console.log('[IRS][Component] Loading submissions (DB only)');

        this.submissionService.getAll().subscribe({
             next: (data: IrsSubmission[]) => {
                console.log('[IRS][Component] Data received from service:', data);

                this.submissions = data ?? [];
                this.loading = false;

                console.log('[IRS][Component] Submissions assigned, count =', this.submissions.length);

                // 🔥 Paso 2: refrescar PENDING
                this.refreshPending();
            },
            error: (err: unknown) => {
                console.error('[IRS][Component] Error loading submissions', err);

                this.error = 'Failed to load IRS submissions.';
                this.loading = false;
            },
            complete: () => {
                console.log('[IRS][Component] loadSubmissions() completed');
            },
        });
    }

    private refreshPending(): void {
        console.log('[IRS][Component] Refreshing PENDING submissions');

        this.submissionService.refreshPending().subscribe({
            next: (data) => {
                this.submissions = data;
                console.log('[IRS][Component] Pending refresh completed');
            },
            error: (err) => {
                console.warn(
                    '[IRS][Component] Pending refresh failed (non-blocking)',
                    err
                );
            },
        });
    }
}
