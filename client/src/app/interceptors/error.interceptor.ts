import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { APIErrorCode, APIErrorCodeMapping } from '../interfaces/errorCodes';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const { status, errorCode } = error.error;

        if (
          status === 'error' &&
          Object.values(APIErrorCode).includes(errorCode)
        ) {
          // Handle known errors
          this.handleAPIError(errorCode);
        } else {
          // Default generic error message if no mapping found
          this.messageService.errorMessage.set(
            'Nie udało się połączyć z serwerem.'
          );
        }

        return throwError(() => error);
      })
    );
  }

  handleAPIError(errorCode: APIErrorCode): void {
    const error = this.APIErrorCodeMapping[errorCode];

    this.messageService.errorMessage.set(error.message);
    if (error.action) {
      error.action();
    }
  }

  readonly APIErrorCodeMapping: APIErrorCodeMapping = {
    'No token provided.': {
      message: 'Twoja sesja wygasła. Zaloguj się ponownie aby kontynuować.',
      action: () => {
        this.authService.removeAuthenticatedFlag();
        this.authService.isSessionExpired.set(true);
      },
    },
    'Invalid verification token.': {
      message: 'Twoja sesja wygasła. Zaloguj się ponownie aby kontynuować.',
      action: () => {
        this.authService.removeAuthenticatedFlag();
        this.authService.isSessionExpired.set(true);
      },
    },
    'Invalid password': {
      message: 'Podano nieprawidłowe hasło.',
    },
    'No query provided.': {
      message:
        'Nie wprowadzono zapytania. Proszę podać zapytanie, aby kontynuować.',
    },
    'No password provided': {
      message: 'Nie wprowadzono hasła. Proszę podać hasło, aby kontynuować.',
    },
    'Internal server error': {
      message: 'Wystąpił błąd serwera. Spróbuj ponownie później.',
    },
    'An error occured while processing the request.': {
      message: 'Wystąpił błąd podczas przetwarzania żądania. Spróbuj ponownie.',
    },
    'It seems that you want to perform a query other than SELECT, which I cannot execute.':
      {
        message:
          'Wygląda na to, że chcesz wykonać zapytanie inne niż SELECT, co nie jest obsługiwane.',
      },
    'Database error. Failed to execute the SQL query.': {
      message: 'Błąd bazy danych. Nie udało się wykonać zapytania SQL.',
    },
  };
}
