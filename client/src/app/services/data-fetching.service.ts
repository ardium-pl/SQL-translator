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
    const sub = this.http
      .post<any>(apiUrl('/language-to-sql'), payload)
      .subscribe({
        next: (res) => {
          // console.log('✅ Response received sucessfully, response body: ', res);
          console.log('✅ HTTP response received sucessfully!');
          try {
            // console.log(`🫃 Response content:`, JSON.stringify(res, null, 2));
            const receivedMessage = res.message || '';
            const receivedSqlStatement = res.sqlStatement || '';
            const receivedFormattedAnswer = res.formattedAnswer || '';
            const receivedRawData = res.rawData || [];

            console.log(`💠 Message: ${receivedMessage}`);
            console.log(`💠 SQL Statement: ${receivedSqlStatement}`);
            console.log(`💠 Formatted Answer: ${receivedFormattedAnswer}`);
            console.log(
              `💠 Row Data: ${JSON.stringify(receivedRawData, null, 2)}`
            );

            this.errorMessage.set(receivedMessage);
            this.rowData.set(receivedRawData);
            this.sqlStatement.set(receivedSqlStatement);
            this.formattedAnswer.set(receivedFormattedAnswer);
            this.isFirstAppOpen.set(false);
          } catch (err) {
            console.log(
              '❌📖 Error reading response body, error message:',
              err
            );
            this.errorMessage.set('Nie udało się odczytać danych otrzymanych z serwera.');
          }
        },
        error: (err) => {
          console.log(
            '❌ Error performing the http request, error message:',
            err
          );
          sub.unsubscribe();
          this.isLoading.set(false);
          this.errorMessage.set('Nie udało się połączyć z serwerem.');
          console.log('⚙️ Subscription terminanated by unsubscribing.');
        },
        complete: () => {
          sub.unsubscribe();
          this.isLoading.set(false);
          console.log('⚙️ Subscription terminanated by unsubscribing.');
        },
      });
  }
}
