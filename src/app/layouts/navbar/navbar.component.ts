import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { interval, Subscription, switchMap } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NzIconModule, NzMenuModule, NzInputModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() searchTextChange = new EventEmitter<string>();

  menuMode: NzMenuModeType
  searchText: string | undefined;

  rates: { usd: number; eur: number; gbp: number } | null = null;
  subscription!: Subscription;

  constructor(private exchangeRateService: ExchangeRateService) {
    this.menuMode = 'horizontal';
  }

  ngOnInit(): void {
    // // 30 saniyede bir verileri çek
    // this.subscription = this.exchangeRateService.getAllRatesToTL().subscribe((data) => {
    //   console.log(data);
    //   // this.rates = {
    //   //   usd: data.usd.data.rates.TRY,
    //   //   eur: data.eur.data.rates.TRY,
    //   //   gbp: data.gbp.data.rates.TRY
    //   // };
    // });
  }

  ngOnDestroy(): void {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
  }

  onSearchTextChange() {
    this.searchTextChange.emit(this.searchText);
  }
}
