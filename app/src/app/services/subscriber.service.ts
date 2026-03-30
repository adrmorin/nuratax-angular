import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubscriberService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/api/subscribers`;

    subscribe(email: string): Observable<unknown> {
        console.log('📧 Suscribiendo email:', email);
        const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
        return this.http.post(this.baseUrl, email, { headers });
    }

    getAllSubscribers(): Observable<unknown[]> {
        return this.http.get<unknown[]>(this.baseUrl);
    }
}
