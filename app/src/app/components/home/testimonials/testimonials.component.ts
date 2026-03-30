import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  reviews = [
    {
      name: 'Maria Gonzalez',
      initials: 'MG',
      company: 'Legal Consulting'
    },
    {
      name: 'Carlos Rodriguez',
      initials: 'CR',
      company: 'TechStart Solutions'
    },
    {
      name: 'Ana Patricia Diaz',
      initials: 'APD',
      company: 'Freelancer'
    },
    {
      name: 'Roberto Silva',
      initials: 'RS',
      company: 'RSM Investments'
    },
    {
      name: 'Laura Mendoza',
      initials: 'LM',
      company: 'Retail Plus'
    },
    {
      name: 'David Chen',
      initials: 'DC',
      company: 'Global E-commerce'
    }
  ];
}
