import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../utils/apiUrl';
import { QueryPayload } from '../interfaces/reqeust-payloads';
import {
  EXAMPLE_FORMATTED_ANSWER,
  EXAMPLE_SQL_STATEMENT,
  EXAMPLE_ROW_DATA_ARRAY,
  EXAMPLE_USER_QUERY,
} from '../utils/exampleValues';
import { RowMYSQL } from '../interfaces/row-mysql';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  private readonly http = inject(HttpClient);
  readonly isLoading = signal<boolean>(false);
  readonly isFirstAppOpen = signal<boolean>(true);
  readonly zapytanieInput = signal<string>(EXAMPLE_USER_QUERY);
  readonly rowData = signal<RowMYSQL[]>(EXAMPLE_ROW_DATA_ARRAY);
  readonly sqlStatement = signal<string>(EXAMPLE_SQL_STATEMENT);
  readonly formattedAnswer = signal<string>(EXAMPLE_FORMATTED_ANSWER);
  readonly errorMessage = signal<string>('');

  fetchAiAnswers(userQuery: string): void {
    this.zapytanieInput.set(userQuery);
    this.isLoading.set(true);
    this.errorMessage.set('');

    console.log('⚙️ Fetching data from backend...');

    const payload: QueryPayload = { query: userQuery };
    this.http
      .post<any>(apiUrl('/language-to-sql'), payload, {
        withCredentials: true, // Has to be true if the request should be sent with outgoing credentials (cookies).
      })
      .subscribe({
        next: (res) => {
          console.log('✅ HTTP response received sucessfully!');

          const { status, message } = res;
          const receivedSqlStatement = res.sqlStatement || '';
          const receivedFormattedAnswer = res.formattedAnswer || '';
          const receivedRawData = res.rawData || [];

          console.log(`💠 Message: ${message}`);
          console.log(`💠 SQL Statement: ${receivedSqlStatement}`);
          console.log(`💠 Formatted Answer: ${receivedFormattedAnswer}`);
          console.log(
            `💠 Row Data: ${JSON.stringify(receivedRawData, null, 2)}`
          );

          this.rowData.set(receivedRawData);
          this.sqlStatement.set(receivedSqlStatement);
          this.formattedAnswer.set(receivedFormattedAnswer);
          this.isFirstAppOpen.set(false);

          if (status === 'error' && message) {
            // Set error message from the backend
            this.errorMessage.set(message);
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
}
