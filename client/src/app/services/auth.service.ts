import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  persistentSignal,
  PersistentStorageMethod
} from '@ardium-ui/devkit';
import { finalize } from 'rxjs';
import { AuthPayload } from '../interfaces/reqeust-payloads';
import { apiUrl } from '../utils/apiUrl';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly messageService = inject(MessageService);
  readonly isLoading = signal<boolean>(false);

  readonly isLoggedIn = persistentSignal<boolean>(false, {
    name: 'isAuthenticated',
    method: PersistentStorageMethod.LocalStorage,
    serialize: (v) => String(v),
    deserialize: v => v === 'true',
  });

  readonly isWaitingForLogout = signal<boolean>(false);

  login(userPassword: string): void {
    if (!userPassword) {
      this.messageService.errorMessage.set('Proszę podać klucz dostępu.');
      return;
    }

    this.isLoading.set(true);

    const payload: AuthPayload = { password: userPassword };
    this.http
      .post<any>(apiUrl('/auth/login'), payload, {
        withCredentials: true, // Has to be true if the request should be sent with outgoing credentials (cookies).
      })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.isLoggedIn.set(true);
          this.router.navigate(['/']);
          this.isLoading.set(false);
        },
      });
  }

  logout(): void {
    this.isWaitingForLogout.set(true);

    // Empty {} as request body needed in order for this to work 😡
    this.http
      .post<any>(
        apiUrl('/auth/logout'),
        {},
        {
          withCredentials: true, // Has to be true if the request should be sent with outgoing credentials (cookies).
        }
      )
      .pipe(finalize(() => this.isWaitingForLogout.set(false)))
      .subscribe({
        next: (res) => {
          // Only remove the 'isAuthenticated' flag and redirect to login page after the session was terminated from the backend perspective
          this.isLoggedIn.set(false);
          this.router.navigate(['/auth/login']);
          this.isWaitingForLogout.set(false);
        },
      });
  }
}
