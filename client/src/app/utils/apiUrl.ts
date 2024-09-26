import { environment } from '../../environments/environment';

export function apiUrl(url: string): string {
  return environment.apiUrl + url.replace(/^\//, '');
}
