import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardTextContentComponent } from './components/card/card-text-content/card-text-content.component';
import { ButtonComponent } from './components/button/button.component';
import { ResultsGridComponent } from './components/results-grid/results-grid.component';
import { DataFetchingService } from './services/data-fetching.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    CardComponent,
    ButtonComponent,
    ResultsGridComponent,
    ReactiveFormsModule,
    CardTextContentComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly dataFetchingService = inject(DataFetchingService);
  readonly displayGrid = signal(false);
  readonly form = new FormGroup({
    userInput: new FormControl(this.dataFetchingService.userInput()),
  });

  submitQuery() {
    const userInput = this.form.value.userInput || '';
    if (!userInput) {
      console.log('🖊️ User input empty, short-circuiting...');
    } else {
      console.log(`🖊️ User input: ${JSON.stringify(userInput, null, 4)}`);
      this.dataFetchingService.fetchAiAnswers(userInput);
    }
  }
}
