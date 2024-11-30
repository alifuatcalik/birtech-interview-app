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
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  markets: Market[];

  private store: Store<AppState>;

  subscriptions: Subscription[] = [];

  constructor() {
    this.store = inject(Store);
  }

  ngOnInit(): void {
    this.subscribeToData();
  }

  subscribeToData() {
    this.subscriptions = [
      this.subscribeToMarkets()
    ]
  }

  subscribeToMarkets() {
    return this.store.select(selectAllMarkets).subscribe((markets: Market[]) => {
      this.markets = markets;
    });
  }

  onSearchTextChange(searchValue: string) {

  }
}
