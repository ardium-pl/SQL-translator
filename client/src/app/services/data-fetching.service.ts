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

  fetchAiAnswers(userQuery: string): void {
    console.log('⚙️ Fetching data from backend...');

    const payload: ReqeustPayload = { query: userQuery };
    const sub = this.http
      .post<any>(apiUrl('/language-to-sql'), payload, {
        headers: {
          'x-api-key': 'our-api-key',
        },
      })
      .subscribe({
        next: (res) => {
          // console.log('✅ Response received sucessfully, response body: ', res);
          console.log('✅ HTTP response received sucessfully!');
          try {
            // console.log(`🫃 Response content:`, JSON.stringify(res, null, 2));
            const receivedMessage = res.message;
            const receivedSqlStatement = res.sqlStatement || '';
            const receivedFormattedAnswer = res.formattedAnswer || '';
            const receivedRawData = res.rawData || [];

            console.log(`💠 Message: ${receivedMessage}`);
            console.log(`💠 SQL Statement: ${receivedSqlStatement}`);
            console.log(`💠 Formatted Answer: ${receivedFormattedAnswer}`);
            console.log(
              `💠 Row Data: ${JSON.stringify(receivedRawData, null, 2)}`
            );

            this.rowData.set(receivedRawData);
            this.sqlStatement.set(receivedSqlStatement);
            this.formattedAnswer.set(receivedFormattedAnswer);
          } catch (err) {
            console.log(
              '❌📖 Error reading response body, error message:',
              err
            );
          }
        },
        error: (err) => {
          console.log(
            '❌ Error performing the http request, error message:',
            err
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
