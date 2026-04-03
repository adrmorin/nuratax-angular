import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-tax-worksheet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-tax-worksheet.component.html',
  styleUrl: './sales-tax-worksheet.component.css'
})
export class SalesTaxWorksheetComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    l1_stateSalesTaxTable: [0],
    l6_localSalesTax: [0],
    l7_specifiedItemsTax: [0]
  });

  totalSalesTax = computed(() => {
    return (this.form.get('l1_stateSalesTaxTable')?.value || 0) +
           (this.form.get('l6_localSalesTax')?.value || 0) +
           (this.form.get('l7_specifiedItemsTax')?.value || 0);
  });

  onSubmit() {
    console.log('Sales Tax Worksheet Submitted', this.form.value);
  }
}
