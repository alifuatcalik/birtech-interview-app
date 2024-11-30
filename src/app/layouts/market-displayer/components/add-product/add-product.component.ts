import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Market, Shelf } from '../../../../models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AppState } from '../../../../states/market.reducer';
import { Store } from '@ngrx/store';
import { addProduct } from '../../../../states/market.actions';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzInputModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  @Input() selectedShelf: Shelf; // Üst component'ten gelecek seçili reyon
  @Input() selectedMarket: Market; // Üst component'ten gelecek seçili reyon

  @Output() addProductModalVisibilityChange = new EventEmitter<boolean>();
  addProductForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.addProductForm = this.fb.group({
      productId: ['', [Validators.required, Validators.minLength(1)]], // Ürün ID
      productName: ['', [Validators.required, Validators.minLength(1)]], // Ürün Adı
      shelfName: [{ value: this.selectedShelf.type, disabled: true }] // Reyon Adı
    });
  }

  onSubmit() {
    if (this.addProductForm.valid) {
      const newProduct = {
        id: this.addProductForm.get('productId')!.value,
        name: this.addProductForm.get('productName')!.value,
        category: this.selectedShelf.type // Reyon tipi
      };

      console.log('Yeni Ürün:', newProduct);

      this.store.dispatch(addProduct({
        marketId: this.selectedMarket.id,
        shelfId: this.selectedShelf.id,
        product: newProduct
      }));
      this.addProductModalVisibilityChange.emit(false);
    }
  }

}
