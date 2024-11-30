import { Component, inject, Input } from '@angular/core';
import { Market, Product, Shelf } from '../../models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { deleteShelf } from '../../states/market.actions';
import { AppState } from '../../states/market.reducer';
import { Store } from '@ngrx/store';
import { AddShelfComponent } from "./components/add-shelf/add-shelf.component";
import { AddProductComponent } from "./components/add-product/add-product.component";
import { ChangeProductComponent } from "./components/change-product/change-product.component";

@Component({
  selector: 'app-market-displayer',
  standalone: true,
  imports: [FormsModule, CommonModule, NzTableModule, NzDividerModule, NzButtonModule, NzIconModule, NzModalModule, AddShelfComponent, AddProductComponent, ChangeProductComponent],
  templateUrl: './market-displayer.component.html',
  styleUrl: './market-displayer.component.scss'
})
export class MarketDisplayerComponent {

  @Input() markets: Market[];

  addShelfModalVisibility = false;
  addProductModalVisibility = false;
  changeProductModalVisibility = false;

  selectedMarket: Market;
  selectedShelf: Shelf;
  selectedProduct: Product;

  store: Store<AppState>;

  constructor() {
    this.store = inject(Store);
  }

  addShelf(market: Market) {
    this.selectedMarket = market;
    this.addShelfModalVisibility = true;
  }

  changeProductInfo(market: Market, shelf: Shelf, product: Product) {
    this.selectedMarket = market;
    this.selectedShelf = shelf;
    this.selectedProduct = product;
    this.changeProductModalVisibility = true;
  }

  addProduct(market: Market, shelf: Shelf) {
    this.selectedMarket = market;
    this.selectedShelf = shelf;
    this.addProductModalVisibility = true;
  }

  deleteShelf(market: Market, shelf: Shelf) {
    this.selectedMarket = market;
    this.selectedShelf = shelf;
    this.store.dispatch(deleteShelf({ marketId: this.selectedMarket.id, shelfId: this.selectedShelf.id }));
  }

  modalCancel(opt: string) {
    if (opt === 'addShelfModalVisibility') {
      this.addShelfModalVisibility = false;
    } else if (opt === 'addProductModalVisibility') {
      this.addProductModalVisibility = false;
    } else if (opt === 'changeProductModalVisibility') {
      this.changeProductModalVisibility = false;
    }
  }

  onAddShelfModalVisibility(visibility: boolean) {
    this.addShelfModalVisibility = visibility;
  }

  onAddProductModalVisibility(visibility: boolean) {
    this.addProductModalVisibility = visibility;
  }

  onChangeProductModalVisibility(visibility: boolean) {
    this.changeProductModalVisibility = visibility;
  }
}
