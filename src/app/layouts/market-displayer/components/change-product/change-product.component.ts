import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../states/market.reducer';
import { Market, Product, Shelf } from '../../../../models';
import { moveProduct, removeProduct } from '../../../../states/market.actions';

@Component({
  selector: 'app-change-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
  ],
  templateUrl: './change-product.component.html',
  styleUrls: ['./change-product.component.scss']
})
export class ChangeProductComponent implements OnInit {

  @Input() selectedMarket!: Market; // Değişmez
  @Input() selectedShelf!: Shelf; // Değişmez
  @Input() selectedProduct!: Product; // Değişmez
  @Input() markets!: Market[]; // Tüm market listesi

  @Output() changeProductModalVisibility = new EventEmitter<boolean>();

  changeProductForm!: FormGroup; // Form
  filteredShelves: Shelf[] = []; // Yeni reyonlar için filtre

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    // Formu başlat
    this.initializeForm();

    // Başlangıçta mevcut marketin reyonlarını filtrele
    this.filterShelves(this.selectedMarket.id);
  }

  // Formu oluştur
  private initializeForm(): void {
    this.changeProductForm = this.fb.group({
      productId: [{ value: this.selectedProduct.id, disabled: true }],
      productName: [this.selectedProduct.name, Validators.required],
      currentShelfType: [{ value: this.selectedShelf.type, disabled: true }],
      targetMarketId: [this.selectedMarket.id, Validators.required], // Başlangıç market
      targetShelfId: [this.selectedShelf.id, Validators.required], // Başlangıç reyon
    });
  }

  // Market değiştiğinde çağrılır
  onTargetMarketChange(targetMarketId: string): void {
    const targetMarket = this.markets.find(market => market.id === targetMarketId);

    if (targetMarket) {
      this.filterShelves(targetMarket.id);

      // İlk reyonu seç
      if (this.filteredShelves.length > 0) {
        this.changeProductForm.patchValue({
          targetShelfId: this.filteredShelves[0].id
        });
      }
    }
  }

  // Belirli bir marketin reyonlarını filtrele
  private filterShelves(targetMarketId: string): void {
    const targetMarket = this.markets.find(market => market.id === targetMarketId);
    if (targetMarket) {
      this.filteredShelves = targetMarket.shelves.filter(
        shelf => shelf.type === this.selectedShelf.type
      );
    }
  }

  deleteProduct(marketId: string, shelfId: string, productId: string) {
    this.store.dispatch(removeProduct({ marketId, shelfId, productId }));
    this.changeProductModalVisibility.emit(false);
  }

  // Form submit edildiğinde çağrılır
  onSubmit(): void {
    if (this.changeProductForm.valid) {
      const formValues = this.changeProductForm.getRawValue(); // Disabled alanları da dahil et

      this.store.dispatch(moveProduct({
        productId: this.selectedProduct.id,
        productName: formValues.productName,
        sourceMarketId: this.selectedMarket.id, // Orijinal market
        sourceShelfId: this.selectedShelf.id, // Orijinal reyon
        targetMarketId: formValues.targetMarketId, // Yeni market
        targetShelfId: formValues.targetShelfId // Yeni reyon
      }));
    }
    this.changeProductModalVisibility.emit(false);
  }
}
