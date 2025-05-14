import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class KevelService {
  private endpoint = 'https://e-11580.adzerk.net/api/v2'; // Update if different
  private lastRequests: Record<string, any> = {};
  private lastResponses: Record<string, any> = {};
  private lastRequestBody: any;

  constructor(private http: HttpClient) {}

 
  getAd(type: string, body: any): Observable<any> {
    this.lastRequests[type] = body;
    return this.http.post(this.endpoint, body);
  }

  getLastRequest(type: string): any {
    return this.lastRequests[type] || null;
  }

  getLastResponse(type: string): any {
    return this.lastResponses[type] || null;
  }

  saveLastResponse(type: string, res: any): void {
    this.lastResponses[type] = res;
  }

  trackImpression(impressionUrl: string): void {
    this.http.get(impressionUrl, { responseType: 'text' }).subscribe({
      next: () => console.log('Impression fired'),
      error: (err) => console.warn('Impression failed', err),
    });
  }

  trackClick(clickUrl: string): void {
    this.http.get(clickUrl, { responseType: 'text' }).subscribe({
      next: () => console.log('Click tracked'),
      error: (err) => console.warn('Click failed', err),
    });
  }

}
