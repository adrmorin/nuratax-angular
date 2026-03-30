import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GetTaxButtonComponent } from "../get-tax-button/get-tax-button.component";

@Component({
  selector: 'app-home-two-slide-5',
  templateUrl: './slide-5.component.html',
  styleUrls: ['./slide-5.component.scss'],
  imports: [GetTaxButtonComponent, TranslateModule]
})
export class HomeTwoSlide5Component {}
