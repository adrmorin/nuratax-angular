import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, timeout } from 'rxjs';
import { AnalysisResponse } from '../interfaces/analysisResponse-interface';
import { environment } from '../../environments/environment';

const BASE_URL = `${environment.apiUrl}/api/n8n`;

@Injectable({ providedIn: 'root' })
export class DocumentAnalysisService {

    constructor(private readonly http: HttpClient) { }

    analyzeDocuments(files: File[], sessionKey: string): Observable<AnalysisResponse> {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file, file.name);
        });

        formData.append('sessionKey', sessionKey);

        formData.append(
            'documentList',
            JSON.stringify(
                files.map((file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                })),
            ),
        );

        console.log('[DocumentAnalysis] Sending multipart request', {
            url: `${BASE_URL}/files/read`,
            filesCount: files.length,
            sessionKey,
            includesList: true,
        });

        return this.http
            .post<AnalysisResponse>(`${BASE_URL}/files/read`, formData)
            .pipe(
                timeout(20000),
                tap((res: any) => {
                    console.log('[DocumentAnalysis] Backend response:', res);

                    if (res?.correlationId) {
                        this.listenToResult(res.correlationId);
                    }
                }),
                catchError((err) => {
                    console.error('[DocumentAnalysis] Request failed', err);
                    return of({ status: 'ERROR', message: 'Document analysis failed' });
                })
            );
    }

    private listenToResult(correlationId: string): void {
        const url = `${environment.apiUrl}/api/chat/stream/${correlationId}`;
        const eventSource = new EventSource(url);

        console.log('[DocumentAnalysis] SSE connected', correlationId);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            console.log('[DocumentAnalysis] SSE event received', data);

            if (data.type === 'FILE_READER_RESULT') {
                // 👉 AQUI TIENES EL W-2 / 1099
                console.log('[DocumentAnalysis] Parsed document:', data);
                eventSource.close();
            }
        };

        eventSource.onerror = (err) => {
            console.error('[DocumentAnalysis] SSE error', err);
            eventSource.close();
        };
    }


}
