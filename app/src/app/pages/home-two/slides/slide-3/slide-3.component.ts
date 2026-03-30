import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GetTaxButtonComponent } from "../get-tax-button/get-tax-button.component";

@Component({
  selector: 'app-home-two-slide-3',
  templateUrl: './slide-3.component.html',
  styleUrls: ['./slide-3.component.scss'],
  imports: [GetTaxButtonComponent, TranslateModule]
})
export class HomeTwoSlide3Component {}
