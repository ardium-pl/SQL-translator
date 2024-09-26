import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { CardConfig } from '../interfaces/card-config';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ResultsGridComponent } from '../results-grid/results-grid.component';
import { ButtonConfig } from '../interfaces/button-config';
import { DataFetchingService } from '../services/data-fetching.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    ResultsGridComponent,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() config!: Signal<CardConfig>;
  readonly dataFetchingService = inject(DataFetchingService);

  form!: FormGroup;
  buttonConfig!: ButtonConfig;

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

    this.buttonConfig = this.config().buttonConfig || {
      type: 'submit',
      text: 'Submit',
    };
  }
}
