import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Client {
    id: number;
    name: string;
    initials: string;
    email: string;
    tags: string[];
    fiscalYear: string;
    lastContact: string;
}

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.css'
})
export class ClientsComponent {
    clients: Client[] = [
        {
            id: 1,
            name: 'María González',
            initials: 'MG',
            email: 'maria.gonzalez@email.com',
            tags: ['VIP', 'Activo'],
            fiscalYear: '2024',
            lastContact: 'Hace 2 días'
        },
        {
            id: 2,
            name: 'Carlos Rodríguez',
            initials: 'CR',
            email: 'carlos.rodriguez@email.com',
            tags: ['Premium', 'En Revisión'],
            fiscalYear: '2024',
            lastContact: 'Hace 1 semana'
        },
        {
            id: 3,
            name: 'Ana Martínez',
            initials: 'AM',
            email: 'ana.martinez@email.com',
            tags: ['Premium', 'Activo'],
            fiscalYear: '2024',
            lastContact: 'Hace 3 días'
        },
        {
            id: 4,
            name: 'Juan López',
            initials: 'JL',
            email: 'juan.lopez@email.com',
            tags: ['Miembro', 'Pendiente'],
            fiscalYear: '2024',
            lastContact: 'Hace 5 días'
        },
        {
            id: 5,
            name: 'Laura Fernández',
            initials: 'LF',
            email: 'laura.fernandez@email.com',
            tags: ['VIP', 'Activo'],
            fiscalYear: '2024',
            lastContact: 'Hoy'
        }
    ];

    getAvatarColor(initials: string): string {
        if (initials === 'MG' || initials === 'LF') return '#688071';
        if (initials === 'CR' || initials === 'AM') return '#94a3b8';
        return '#cbd5e1';
    }

    getTagClass(tag: string): string {
        const tagMap: Record<string, string> = {
            'VIP': 'tag-vip',
            'Premium': 'tag-premium',
            'Miembro': 'tag-miembro',
            'Activo': 'tag-activo',
            'En Revisión': 'tag-revision',
            'Pendiente': 'tag-pendiente'
        };
        return tagMap[tag] || '';
    }
}
