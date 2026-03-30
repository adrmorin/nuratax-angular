import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-tax-button',
  templateUrl: './get-tax-button.component.html',
  styleUrls: ['./get-tax-button.component.scss']
})
export class GetTaxButtonComponent {
  @Input() label = 'Get Your Tax';
  constructor(private router: Router) {}

  goToTax(): void {
    this.router.navigate(['/tax-declaration']);
  }
}
