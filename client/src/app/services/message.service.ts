import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  readonly errorMessage = signal<string>('');
}
