import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class EventStreamService {

  private readonly apiUrl = environment.apiUrl;

  connect(correlationId: string): EventSource {
    const url = `${this.apiUrl}/api/chat/stream/${correlationId}`;
    console.log('[EventStreamService] Opening SSE connection:', url);

    return new EventSource(url);
}

}
