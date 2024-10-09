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
  readonly errorMessage = signal<string>('');

  login(userPassword: string): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    console.log('⚙️ Starting verification...');

    const payload: AuthPayload = { password: userPassword };
    this.http.post<any>(apiUrl('/login'), payload).subscribe({
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

        const errorResponse = err.error;
        if (errorResponse && typeof errorResponse === 'object') {
          const { status, message } = errorResponse;

          if (status === 'error' && message) {
            // Set error message from the backend
            this.errorMessage.set(errorResponse.message);
          }
        } else {
          // Set a generic error message if there's no JSON body or message
          this.errorMessage.set('Nie udało się połączyć z serwerem.');
        }
        this.isLoading.set(false);
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
