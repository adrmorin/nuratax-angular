import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GetTaxButtonComponent } from "../get-tax-button/get-tax-button.component";

@Component({
  selector: 'app-home-two-slide-4',
  templateUrl: './slide-4.component.html',
  styleUrls: ['./slide-4.component.scss'],
  imports: [GetTaxButtonComponent, TranslateModule]
})
export class HomeTwoSlide4Component {}
