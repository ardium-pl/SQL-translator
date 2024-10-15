import { Component, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ButtonType } from './button.types';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  readonly disabled = input<boolean, any>(false, {
    transform: coerceBooleanProperty,
  });
  readonly type = input<ButtonType>('button');
}
