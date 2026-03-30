import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AiTool {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconColor: string;
    badge?: string;
    badgeColor?: string;
}

export interface AiPerformanceMetric {
    label: string;
    value: string;
    sublabel: string;
}

@Component({
    selector: 'app-ai-tools',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ai-tools.component.html',
    styleUrl: './ai-tools.component.css'
})
export class AiToolsComponent {
    @Input() showHeader = true;

    aiTools: AiTool[] = [
        {
            id: 'risk-analysis',
            title: 'Análisis de Riesgo de Clientes',
            description: 'IA identifica clientes en riesgo de auditoría o que necesitan atención inmediata',
            icon: 'warning',
            iconColor: '#dc2626',
            badge: '3 clientes marcados',
            badgeColor: 'rgba(30, 41, 59, 0.1)'
        },
        {
            id: 'income-optimization',
            title: 'Optimización de Ingresos',
            description: 'IA sugiere precios óptimos y paquetes de servicios para cada cliente',
            icon: 'trending_up',
            iconColor: '#688071',
            badge: '+$2,400 potencial',
            badgeColor: 'rgba(104, 128, 113, 0.15)'
        },
        {
            id: 'client-matching',
            title: 'Emparejamiento Inteligente de Clientes',
            description: 'IA empareja clientes prospectivos con tu experiencia y capacidad',
            icon: 'groups',
            iconColor: '#688071',
            badge: '5 coincidencias',
            badgeColor: 'rgba(104, 128, 113, 0.15)'
        },
        {
            id: 'performance-forecast',
            title: 'Pronóstico de Rendimiento',
            description: 'IA predice el rendimiento de tu práctica y sugiere estrategias de crecimiento',
            icon: 'analytics',
            iconColor: '#688071',
            badge: '+18% proyectado',
            badgeColor: 'rgba(104, 128, 113, 0.15)'
        },
        {
            id: 'task-prioritization',
            title: 'Priorización de Tareas IA',
            description: 'Ordenación inteligente de tareas basada en fechas límite, impacto y necesidades del cliente',
            icon: 'checklist',
            iconColor: '#688071',
            badge: '12 tareas reordenadas',
            badgeColor: 'rgba(30, 41, 59, 0.1)'
        },
        {
            id: 'deduction-scanner',
            title: 'Escáner Masivo de Deducciones',
            description: 'IA escanea todas las carteras de clientes para oportunidades de deducción perdidas',
            icon: 'search',
            iconColor: '#688071',
            badge: '$18K en ahorros encontrados',
            badgeColor: 'rgba(104, 128, 113, 0.15)'
        }
    ];

    performanceMetrics: AiPerformanceMetric[] = [
        { label: 'Tiempo Ahorrado', value: '23.5 horas', sublabel: 'Este mes' },
        { label: 'Ingresos Adicionales', value: '$4,850', sublabel: 'De insights IA' },
        { label: 'Satisfacción del Cliente', value: '+12%', sublabel: 'Desde usar IA' }
    ];

    onExecuteAnalysis(toolId: string): void {
        console.log(`Executing analysis for tool: ${toolId}`);
        // This can be extended to emit an event or call a service
    }
}
