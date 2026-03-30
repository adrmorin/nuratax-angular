import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiToolsComponent } from '../../components/dashboard/ai-tools.component';

@Component({
    selector: 'app-ai-tools-page',
    standalone: true,
    imports: [CommonModule, AiToolsComponent],
    templateUrl: './ai-tools.component.html',
    styleUrl: './ai-tools.component.css'
})
export class AiToolsPageComponent { }
