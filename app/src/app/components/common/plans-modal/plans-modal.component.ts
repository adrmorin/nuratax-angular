import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-plans-modal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './plans-modal.component.html',
  styleUrl: './plans-modal.component.css'
})
export class PlansModalComponent {
  public modalService = inject(ModalService);
}
