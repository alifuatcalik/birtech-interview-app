import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CurrencyService } from '../../services/currency-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NzIconModule, NzMenuModule, NzInputModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  @Output() searchTextChange = new EventEmitter<string>();

  menuMode: NzMenuModeType
  searchText: string;

  usdToTry: number;
  eurToTry: number;
  gbpToTry: number;

  private intervalId: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.menuMode = 'horizontal';
    this.fetchCurrencyRates();

    // 30 saniyede bir veri çekmek için interval kullanıyoruz
    this.intervalId = setInterval(() => {
      this.fetchCurrencyRates();
    }, 30000); // 30 saniye (30,000 ms)
  }

  // Döviz kurlarını çeken metod
  fetchCurrencyRates(): void {
    // USD -> TRY kuru
    this.subscriptions.push(
      this.currencyService.getUsdToTry().subscribe(data => {
        this.usdToTry = data.conversion_rates.TRY;
      }, error => {
        console.error('Hata:', error);
      })
    );

    // EUR -> TRY kuru
    this.subscriptions.push(
      this.currencyService.getEurToTry().subscribe(data => {
        this.eurToTry = data.conversion_rates.TRY;
      }, error => {
        console.error('Hata:', error);
      })
    );

    // GBP -> TRY kuru
    this.subscriptions.push(
      this.currencyService.getGbpToTry().subscribe(data => {
        this.gbpToTry = data.conversion_rates.TRY;
      }, error => {
        console.error('Hata:', error);
      })
    );
  }

  onSearchTextChange() {
    this.searchTextChange.emit(this.searchText);
  }
}
