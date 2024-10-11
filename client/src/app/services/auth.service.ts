import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthPayload } from '../interfaces/reqeust-payloads';
import { apiUrl } from '../utils/apiUrl';
import { Router } from '@angular/router';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly messageService = inject(MessageService);
  readonly isLoading = signal<boolean>(false);
  readonly isSessionExpired = signal<boolean>(false);
  readonly isWaitingForLogout = signal<boolean>(false);

  login(userPassword: string): void {
    if (!userPassword) {
      this.messageService.errorMessage.set('Proszę podać klucz dostępu.');
      return;
    }

    this.isLoading.set(true);
    this.messageService.errorMessage.set('');

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
            this.isSessionExpired.set(false);
            this.router.navigate(['/']);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(
            '❌ Error performing the http request, error message:',
            err
          );
          this.isLoading.set(false);
        },
      });
  }

  logout(): void {
    this.isWaitingForLogout.set(true);
    this.messageService.errorMessage.set('');

    console.log('⚙️ Logging out...');

    // Empty {} as request body needed in order for this to work 😡
    this.http
      .post<any>(
        apiUrl('/logout'),
        {},
        {
          withCredentials: true, // Has to be true if the request should be sent with outgoing credentials (cookies).
        }
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            console.log(`Client side cookie cleared successfully.`);
          }

          // Only remove the 'isAuthenticated' flag and redirect to login page after the session was terminated from the backend perspective
          this.removeAuthenticatedFlag();
          this.router.navigate(['/login']);
          console.log(`Logged out successfully.`);
          this.isWaitingForLogout.set(false);
        },
        error: (err) => {
          console.log(
            '❌ Error performing the http request, error message:',
            err
          );
          this.isWaitingForLogout.set(false);
        },
      });
  }

  persistLoggedInState(): void {
    localStorage.setItem('isAuthenticated', 'true');
  }

  removeAuthenticatedFlag(): void {
    localStorage.removeItem('isAuthenticated');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
}
