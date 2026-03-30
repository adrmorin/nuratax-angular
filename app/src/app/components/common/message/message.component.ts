import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-message',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent {
    @Input() type: 'success' | 'error' | 'info' = 'info';
    @Input() message = '';

    get iconName(): string {
        switch (this.type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'info': return 'info';
            default: return 'info';
        }
    }
}
