import { Component, Input, OnInit, Signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CardConfig } from '../interfaces/card-config';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() config!: Signal<CardConfig>;

  form!: FormGroup;
  onSubmit!: () => void;

  ngOnInit(): void {
    if (this.config().type === 'input') {
      this.form = new FormGroup({
        userInput: new FormControl(this.config().placeholderText),
      });

      this.onSubmit = () => {
        const userInput = this.form.value.userInput || '';

        this.config().submitAction!(userInput);
      };
    }
  }
}
