import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthPayload } from '../interfaces/reqeust-payloads';
import { apiUrl } from '../utils/apiUrl';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly isLoading = signal<boolean>(false);
  readonly waitingForLogout = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  login(userPassword: string): void {
    if (!userPassword) {
      this.errorMessage.set('Proszę podać klucz dostępu.')
      return
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    console.log('⚙️ Starting verification...');

    const payload: AuthPayload = { password: userPassword };
    this.http
      .post<any>(apiUrl('/login'), payload, {
        withCredentials: true, // Has to be true if the request should be sent with outgoing credentials (cookies).
      })
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            console.log(`✅ Verification successful!`);
            this.persistLoggedInState();
            this.router.navigate(['/']);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(
            '❌ Error performing the http request, error message:',
            err
          );

          const { status, message } = err.error;
          if (status === 'error' && message) {
            // Set error message from the backend
            this.errorMessage.set(message);
          } else {
            // Set a generic error message if there's no JSON body or message
            this.errorMessage.set('Nie udało się połączyć z serwerem.');
          }
          this.isLoading.set(false);
        },
      });
  }

  logout(): void {
    this.waitingForLogout.set(true);
    this.errorMessage.set('');

    console.log('⚙️ Logging out...');

    // Empty {} as request body needed in order for this to work 😡
    this.http
      .post<any>(apiUrl('/logout'), {}, {
        withCredentials: true, // Has to be true if the request should be sent with outgoing credentials (cookies).
      })
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            console.log(`Client side cookie cleared successfully.`);
          }

          // Only remove the 'isAuthenticated' flag and redirect to login page after the session was terminated from the backend perspective
          localStorage.removeItem('isAuthenticated');
          this.router.navigate(['/login']);
          console.log(`Logged out successfully.`);
          this.waitingForLogout.set(false);
        },
        error: (err) => {
          console.log(
            '❌ Error performing the http request, error message:',
            err
          );

          const { status, message } = err.error;
          if (status === 'error' && message) {
            // Set error message from the backend
            this.errorMessage.set(message);
          } else {
            // Set a generic error message if there's no JSON body or message
            this.errorMessage.set('Nie udało się wylogować.');
          }
          this.waitingForLogout.set(false);
        },
      });
  }

  persistLoggedInState(): void {
    localStorage.setItem('isAuthenticated', 'true');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
}
