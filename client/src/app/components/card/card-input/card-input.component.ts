import { Component, inject, input, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { DataFetchingService } from '../../../services/data-fetching.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-card-input',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './card-input.component.html',
  styleUrl: './card-input.component.scss',
})
export class CardInputComponent {
  readonly dataFetchingService = inject(DataFetchingService);
  readonly inheritedFormControl = input<FormControl>(new FormControl());
  readonly errorState = input<string | boolean>(false);
  readonly isError = computed(() => (this.errorState() ? true : false));
}
