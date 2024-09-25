import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../utils/apiUrl';
import { ReqeustPayload } from '../interfaces/reqeust-payload';
import {
  EXAMPLE_FORMATTED_ANSWER,
  EXAMPLE_SQL_STATEMENT,
  EXAMPLE_ROW_DATA,
} from '../utils/exampleValues';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  private readonly http = inject(HttpClient);
  readonly rowData = signal<any[]>(EXAMPLE_ROW_DATA);
  readonly sqlStatement = signal<string>(EXAMPLE_SQL_STATEMENT);
  readonly formattedAnswer = signal<string>(EXAMPLE_FORMATTED_ANSWER);

  fetchAiAnswers(userQuery: ReqeustPayload): void {
    const sub = this.http
      .post<any>(apiUrl('/language-to-sql'), userQuery, {
        headers: {
          'x-api-key': 'our-api-key',
        },
      })
      .subscribe({
        next: (res) => {},
        error: (err) => {
          console.log(
            `❌ Error performing the http request, error message: ${err}`
          );
          sub.unsubscribe();
          console.log('⚙️ Subscription terminanated by unsubscribing.');
        },
        complete: () => {
          sub.unsubscribe();
          console.log('⚙️ Subscription terminanated by unsubscribing.');
        },
      });
  }
}
