import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "./layouts/navbar/navbar.component";
import { Market } from './models';
import { Store } from '@ngrx/store';
import { AppState } from './states/market.reducer';
import { selectAllMarkets } from './states/market.selector';
import { Subscription } from 'rxjs';
import { MarketDisplayerComponent } from "./layouts/market-displayer/market-displayer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, MarketDisplayerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  markets: Market[] = []; // Orijinal market listesi
  filteredMarkets: Market[] = []; // Filtrelenmiş market listesi

  private store: Store<AppState>;
  subscriptions: Subscription[] = [];

  constructor() {
    this.store = inject(Store);
  }

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    // Abonelikleri temizle
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  subscribeToData() {
    this.subscriptions = [
      this.subscribeToMarkets()
    ];
  }

  subscribeToMarkets() {
    return this.store.select(selectAllMarkets).subscribe((markets: Market[]) => {
      this.markets = markets;

      // Varsayılan olarak tüm markets'i göster
      this.filteredMarkets = [...this.markets];
    });
  }

  onSearchTextChange(searchValue: string) {
    if (!searchValue.trim()) {
      this.filteredMarkets = [...this.markets];
      return;
    }

    const lowerCaseSearch = searchValue.toLowerCase();

    this.filteredMarkets = this.markets.map((market) => {
      const filteredShelves = market.shelves
        .map((shelf) => {
          const filteredProducts = shelf.products.filter((product) =>
            product.name.toLowerCase().includes(lowerCaseSearch)
          );

          if (filteredProducts.length > 0) {
            return { ...shelf, products: filteredProducts };
          }
          return null;
        })
        .filter((shelf): shelf is NonNullable<typeof shelf> => shelf !== null);

      return { ...market, shelves: filteredShelves }; // Market korunur, shelves güncellenir
    });
  }
}
