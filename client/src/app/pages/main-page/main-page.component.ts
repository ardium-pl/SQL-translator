import { Component, signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { CardTextContentComponent } from '../../components/card/card-text-content/card-text-content.component';
import { CardComponent } from '../../components/card/card.component';
import { ResultsGridComponent } from '../../components/results-grid/results-grid.component';
import { DataFetchingService } from '../../services/data-fetching.service';

@Component({
  selector: 'app-main-page',
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
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
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
