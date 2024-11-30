import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiKey = 'e04f4797d9d4eaf7eb1e543e';
  private baseUrl = 'https://v6.exchangerate-api.com/v6/';

  constructor(private http: HttpClient) { }

  // USD -> TRY kuru
  getUsdToTry(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiKey}/latest/USD`);
  }

  // EUR -> TRY kuru
  getEurToTry(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiKey}/latest/EUR`);
  }

  // GBP -> TRY kuru
  getGbpToTry(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${this.apiKey}/latest/GBP`);
  }
}
