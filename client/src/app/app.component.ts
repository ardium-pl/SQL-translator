import { Component, computed, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './card/card.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { DataFetchingService } from './services/data-fetching.service';
import { inject } from '@angular/core';
import { EXAMPLE_USER_QUERY } from './utils/exampleValues';
import { CardConfig } from './interfaces/card-config';
import { ButtonConfig } from './interfaces/button-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    CardComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly dataFetchingService = inject(DataFetchingService);
  readonly displayGrid = signal(false);

  readonly queryCardConfig: Signal<CardConfig> = computed((): CardConfig => {
    return {
      type: 'input',
      title: 'Zapytanie do bazy danych',
      placeholderText: this.dataFetchingService.userInput(),
      buttonConfig: {
        type: 'submit',
        text: 'Zatwierdź',
      },
      submitAction: (userInput: string) => {
        if (!userInput) {
          console.log('🖊️ User input empty, short-circuiting...');
        } else {
          console.log(`🖊️ User input: ${JSON.stringify(userInput, null, 4)}`);
          this.dataFetchingService.fetchAiAnswers(userInput);
        }
      },
    };
  });

  readonly aiAnswerCardConfig: Signal<CardConfig> = computed((): CardConfig => {
    return {
      type: 'default',
      title: 'Odpowiedź Asystenta',
      placeholderText: this.dataFetchingService.formattedAnswer(),
    };
  });

  readonly sqlStatementCardConfig: Signal<CardConfig> = computed(
    (): CardConfig => {
      return {
        type: 'default',
        title: 'Tłumaczenie SQL',
        placeholderText: this.dataFetchingService.sqlStatement(),
      };
    }
  );

  readonly gridCardConfig: Signal<CardConfig> = computed((): CardConfig => {
    return {
      type: 'grid',
      title: 'Dane z bazy',
      buttonConfig: {
        type: 'text',
        text: 'Powrót',
        onClick: () => this.displayGrid.set(false),
      },
    };
  });

  readonly showGridButtonConfig: ButtonConfig = {
    type: 'text',
    text: 'Przejdź do tabeli rezultatów',
    onClick: () => this.displayGrid.set(true),
  };

  // queryForm = new FormGroup({
  //   userInput: new FormControl(EXAMPLE_USER_QUERY),
  // });

  // onSubmit() {
  //   const userInput = this.queryForm.value.userInput || '';
  //   if (!userInput) {
  //     console.log('🖊️ User input empty, short-circuiting...');
  //   } else {
  //     console.log(`🖊️ User input: ${JSON.stringify(userInput, null, 4)}`);
  //     this.dataFetchingService.fetchAiAnswers(userInput);
  //   }
  // }
}
