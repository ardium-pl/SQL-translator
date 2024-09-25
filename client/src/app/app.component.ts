import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardComponent } from './card/card.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { DataFetchingService } from './services/data-fetching.service';
import { inject } from '@angular/core';
import { EXAMPLE_USER_QUERY } from './utils/exampleValues';

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

  title = 'SQL-translator';
  queryForm = new FormGroup({
    userInput: new FormControl(EXAMPLE_USER_QUERY),
  });

  onSubmit() {
    console.log(JSON.stringify(this.queryForm.value.userInput, null, 4));
  }
}
