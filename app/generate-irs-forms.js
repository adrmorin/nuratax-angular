// generate-irs-forms.js
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, 'src', 'app', 'components', 'forms');

const forms = [
  { name: 'form8936', title: 'Form 8936 – Qualified Plug‑in Electric Drive Motor Vehicle Credit', fields: ['line1','line2','line3'] },
  { name: 'form990t', title: 'Form 990‑T – Exempt Organization Business Income Tax Return', fields: ['line1','line2'] },
  { name: 'form4255', title: 'Form 4255 – Partnership Interest Income', fields: ['line1','line2','line3'] },
  { name: 'form3468', title: 'Form 3468 – Investment Credit', fields: ['line1','line2'] },
  { name: 'form1120', title: 'Form 1120 – U.S. Corporation Income Tax Return', fields: ['line1','line2','line3','line4'] },
  { name: 'form7220', title: 'Form 7220 – Tax on Certain Foreign Corporations', fields: ['line1'] },
  { name: 'form5329', title: 'Form 5329 – Additional Taxes on Qualified Plans (Including IRAs) and Other Tax‑Favored Accounts', fields: ['line1','line2','line3'] },
  { name: 'form8606', title: 'Form 8606 – Nondeductible IRAs', fields: ['line1','line2','line3'] },
  { name: 'form1099r', title: 'Form 1099‑R – Distributions From Pensions, Annuities, Retirement or Profit‑Sharing Plans, IRAs, Insurance Contracts, etc.', fields: ['line1','line2','line3','line4'] },
  { name: 'form8915f', title: 'Form 8915‑F – Qualified Disaster Retirement Plan Distributions and Repayments', fields: ['line1','line2'] },
  { name: 'form8611', title: 'Form 8611 – Interest Expense Allocation Worksheet', fields: ['line1','line2'] },
  { name: 'form8586', title: 'Form 8586 – Low‑Income Housing Credit', fields: ['line1','line2','line3'] },
  { name: 'form8609', title: 'Form 8609 – Low‑Income Housing Credit – Allocation of Credit to Owners of Qualified Low‑Income Housing Projects', fields: ['line1','line2'] },
  { name: 'form8609a', title: 'Form 8609‑A – Low‑Income Housing Credit – Allocation of Credit to Owners of Qualified Low‑Income Housing Projects (Alternative)', fields: ['line1'] },
  { name: 'form8693', title: 'Form 8693 – Qualified Business Income Deduction', fields: ['line1','line2'] },
  { name: 'form8621', title: 'Form 8621 – Return by a Shareholder of a Passive Foreign Investment Company or Qualified Electing Fund', fields: ['line1','line2','line3'] },
  { name: 'schedulej', title: 'Schedule J (Form 5471) – Accumulated Earnings and Profits', fields: ['line1','line2'] },
  { name: 'form8621a', title: 'Form 8621‑A – Supplemental Schedule for Form 8621', fields: ['line1'] },
  { name: 'form8697', title: 'Form 8697 – Interest Expense Allocation Worksheet', fields: ['line1','line2'] },
  { name: 'form8919', title: 'Form 8919 – Uncollected Social Security and Medicare Tax on Wages', fields: ['line1','line2'] },
  { name: 'form8960', title: 'Form 8960 – Net Investment Income Tax', fields: ['line1','line2','line3'] },
  { name: 'form8833', title: 'Form 8833 – Treaty-Based Return Position Disclosure', fields: ['line1','line2'] },
  { name: 'form965a', title: 'Form 965‑A – Tax on Certain Foreign Corporations (Section 965)', fields: ['line1'] },
  { name: 'form965c', title: 'Form 965‑C – Tax on Certain Foreign Corporations (Section 965) – Schedule', fields: ['line1'] },
  { name: 'form965d', title: 'Form 965‑D – Tax on Certain Foreign Corporations (Section 965) – Schedule', fields: ['line1'] },
  { name: 'form965e', title: 'Form 965‑E – Tax on Certain Foreign Corporations (Section 965) – Schedule', fields: ['line1'] }
];

function pascalCase(str) {
  return str.replace(/(^\w|[-_]\w)/g, m => m.replace(/[-_]/, '').toUpperCase());
}

forms.forEach(f => {
  const folder = path.join(baseDir, f.name);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  // TS component
  const tsContent = `import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: '${f.name}',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './${f.name}.component.html',
  styleUrls: ['./${f.name}.component.css']
})
export class ${pascalCase(f.name)}Component {
  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({${f.fields.map(fl => `\n    ${fl}: ['']`).join('')}\n  });
  }

  onSubmit() {
    console.log('Submitted ${f.title}:', this.form.value);
  }
}
`;
  fs.writeFileSync(path.join(folder, `${f.name}.component.ts`), tsContent);

  // HTML template
  const htmlContent = `<div class="irs-form-container ${f.name}__container">
  <div class="irs-form-box">
    <div class="irs-main-header">
      <div class="irs-col-1">
        <div class="irs-form-id">${f.title.toUpperCase()}</div>
        <div class="irs-form-sub-id">IRS Form</div>
      </div>
      <div class="irs-col-2"><h1>${f.title}</h1></div>
      <div class="irs-col-3"><div class="irs-omb-box">OMB No. ${Math.floor(Math.random()*9000+1000)}‑${Math.floor(Math.random()*9000+1000)}</div></div>
    </div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="irs-grid">
        ${f.fields.map(id => `
        <div class="irs-row">
          <div class="irs-label"><label for="${id}">Line ${id.toUpperCase()}</label></div>
          <div class="irs-input"><input id="${id}" type="text" formControlName="${id}" class="${f.name}__input"/></div>
        </div>`).join('')}
      </div>
      <div class="irs-footer-actions">
        <button type="submit" class="btn-submit">Guardar ${f.title}</button>
      </div>
    </form>
  </div>
</div>
`;
  fs.writeFileSync(path.join(folder, `${f.name}.component.html`), htmlContent);

  // CSS (BEM, mobile‑first, CSS Grid)
  const cssContent = `/* ${f.title} – estilos base */
.${f.name}__container {
  padding: 2rem;
  max-width: 950px;
  margin: 0 auto;
  background: #fff;
  font-family: 'Inter', Arial, sans-serif;
  color: #000;
}
.${f.name}__container .irs-form-box {
  border: 2px solid #000;
}
.${f.name}__container .irs-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.5rem;
}
.${f.name}__container .irs-row {
  display: contents;
}
.${f.name}__container .irs-label {
  align-self: center;
  font-weight: 500;
}
.${f.name}__container .irs-input input {
  width: 100%;
  padding: 4px;
  border: none;
  background: #eef7ff;
  font-size: 1rem;
}
`;
  fs.writeFileSync(path.join(folder, `${f.name}.component.css`), cssContent);
});

// Update routes file
const routesPath = path.resolve(__dirname, 'src', 'app', 'app.routes.ts');
let routesContent = fs.readFileSync(routesPath, 'utf8');
const insertionIdx = routesContent.lastIndexOf('];');
const newRoutes = forms.map(f => `  { path: '${f.name}', loadComponent: () => import('./components/forms/${f.name}/${f.name}.component').then(m => m.${pascalCase(f.name)}Component) },`).join('\n');
const updatedRoutes = routesContent.slice(0, insertionIdx) + '\n' + newRoutes + '\n];';
fs.writeFileSync(routesPath, updatedRoutes);

console.log('All forms generated and routes updated.');
