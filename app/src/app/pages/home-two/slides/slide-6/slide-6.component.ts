import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GetTaxButtonComponent } from "../get-tax-button/get-tax-button.component";

@Component({
  selector: 'app-home-two-slide-6',
  templateUrl: './slide-6.component.html',
  styleUrls: ['./slide-6.component.scss'],
  imports: [GetTaxButtonComponent, TranslateModule]
})
export class HomeTwoSlide6Component {}
