import { Component, inject, Input } from '@angular/core';
import { ButtonConfig } from '../interfaces/button-config';
import { DataFetchingService } from '../services/data-fetching.service';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() config!: ButtonConfig;
  readonly dataFetchingService = inject(DataFetchingService);
}
