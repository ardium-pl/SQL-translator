import { Component, Input } from '@angular/core';
import { ButtonConfig } from '../interfaces/button-config';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() config!: ButtonConfig;
}
