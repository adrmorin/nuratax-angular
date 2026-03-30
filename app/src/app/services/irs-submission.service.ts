import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IrsSubmission } from '../interfaces/irs-submission.interface';

@Injectable({
    providedIn: 'root',
})
export class IrsSubmissionService {

    private readonly baseUrl = `${environment.apiUrl}/api/irs/submissions`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<IrsSubmission[]> {
        console.log('[IRS][Service] GET all submissions →', this.baseUrl);

        return this.http.get<IrsSubmission[]>(this.baseUrl).pipe(
            tap((response) => {
                console.log(
                    '[IRS][Service] Submissions received:',
                    response,
                    'count =',
                    Array.isArray(response) ? response.length : 'not-array'
                );
            }),
            catchError((err) => {
                console.error('[IRS][Service] Failed to load submissions', err);
                throw err;
            })
        );
    }

    refreshPending(): Observable<IrsSubmission[]> {
        const url = `${this.baseUrl}/refresh-pending`;

        console.log('[IRS][Service] Refresh pending submissions →', url);

        return this.http.get<IrsSubmission[]>(url).pipe(
            tap((response) => {
                console.log( '[IRS][Service] Refresh completed. Submissions:', response,
                    'count =', Array.isArray(response) ? response.length : 'not-array');
            }),
            catchError((err) => {
                console.error('[IRS][Service] Failed to refresh pending submissions', err);
                throw err;
            })
        );
    }

    getBySubmissionId(submissionId: string): Observable<IrsSubmission> {
        return this.http.get<IrsSubmission>(`${this.baseUrl}/${submissionId}`);
    }

    getByUser(userId: string): Observable<IrsSubmission[]> {
        return this.http.get<IrsSubmission[]>(`${this.baseUrl}/user/${userId}`);
    }

    getByTaxReturn(taxReturnId: string): Observable<IrsSubmission[]> {
        return this.http.get<IrsSubmission[]>(`${this.baseUrl}/tax-return/${taxReturnId}`);
    }
}
