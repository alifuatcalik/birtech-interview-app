import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiUrl = '/api/v1/rates'; // Base URL

  constructor(private http: HttpClient) { }

  getDollarToTL(): Observable<any> {
    // USD to TRY
    return this.http.get(`${this.apiUrl}?from=USD&to=TRY`);
  }

  getEuroToTL(): Observable<any> {
    // EUR to TRY
    return this.http.get(`${this.apiUrl}?from=EUR&to=TRY`);
  }

  getSterlingToTL(): Observable<any> {
    // GBP to TRY
    return this.http.get(`${this.apiUrl}?from=GBP&to=TRY`);
  }

  getAllRatesToTL(): Observable<any> {
    // Tüm döviz verilerini tek seferde almak için forkJoin kullanabiliriz
    return forkJoin({
      usd: this.getDollarToTL(),
      eur: this.getEuroToTL(),
      gbp: this.getSterlingToTL()
    });
  }
}
