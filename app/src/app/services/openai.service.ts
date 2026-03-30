import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OpenaiService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/api/openai`;


    sendMessage(prompt: string): Observable<unknown> {
        const body = { prompt };
        return this.http.post(`${this.baseUrl}/chat`, body);
    }

    processDocuments(formData: FormData): Observable<unknown> {
        return this.http.post(`${this.baseUrl}/process-documents`, formData);
    }
}
