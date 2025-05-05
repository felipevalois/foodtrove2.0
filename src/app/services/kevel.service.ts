import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class KevelService {
  private endpoint = 'https://e-11580.adzerk.net/api/v2'; // Update if different
  private lastRequestBody: any;

  constructor(private http: HttpClient) {}

  /**
   * Makes a decision request to Kevel.
   */
  getAdDecision(payload: any): Observable<any> {
    return this.http.post(this.endpoint, payload);
  }

  /**
   * Fires the impression URL.
   */
  trackImpression(impressionUrl: string): void {
    this.http.get(impressionUrl, { responseType: 'text' }).subscribe({
      next: () => console.log('Impression fired'),
      error: (err) => console.warn('Impression failed', err),
    });
  }

  /**
   * Fires the click URL.
   */
  trackClick(clickUrl: string): void {
    this.http.get(clickUrl, { responseType: 'text' }).subscribe({
      next: () => console.log('Click tracked'),
      error: (err) => console.warn('Click failed', err),
    });
  }

  getBannerAd(body: any): Observable<any> {
    this.lastRequestBody = body;
    return this.http.post(this.endpoint, body);
  }

  getLastRequest(): any {
    return this.lastRequestBody;
  }
}
