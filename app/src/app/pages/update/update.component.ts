import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/common/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-update',
    standalone: true,
    imports: [CommonModule, HeaderComponent, TranslateModule],
    templateUrl: './update.component.html',
    styleUrl: './update.component.css'
})
export class UpdateComponent {
    selectedMethod = 'card';

    selectMethod(method: string) {
        this.selectedMethod = method;
    }
}
