import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AppState } from '../../../../states/market.reducer';
import { Market } from '../../../../models';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { addShelf } from '../../../../states/market.actions';

@Component({
  selector: 'app-add-shelf',
  standalone: true,
  imports: [
    NzFormModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './add-shelf.component.html',
  styleUrl: './add-shelf.component.scss'
})
export class AddShelfComponent {

  @Input() selectedMarket: Market;

  @Output() addShelfModalVisibilityChange = new EventEmitter<boolean>();

  addShelfForm!: FormGroup;

  marketName: string = '';
  availableShelfTypes: string[] = ['Gıda', 'Temizlik', 'Kırtasiye', 'Kozmetik', 'Elektronik'];
  currentShelfId!: string;

  constructor(private fb: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initForm();
    this.populateMarketData();
  }

  // Form yapısını oluşturma
  initForm() {
    this.addShelfForm = this.fb.group({
      shelfId: [{ value: '', disabled: true }, Validators.required],
      shelfType: [null, Validators.required],
      marketName: [{ value: this.selectedMarket.id, disabled: true }, Validators.required],
    });
  }

  // Market bilgilerini state'ten çekip formu doldurma
  populateMarketData() {
    if (this.selectedMarket) {
      this.marketName = this.selectedMarket.name;

      // Son Reyon ID'sine göre yeni ID oluşturma
      const lastShelfId = this.selectedMarket.shelves?.[this.selectedMarket.shelves.length - 1]?.id || 'R0';
      const newShelfNumber = parseInt(lastShelfId.substring(1)) + 1;
      this.currentShelfId = `R${newShelfNumber}`;

      // Formu doldurma
      this.addShelfForm.patchValue({
        shelfId: this.currentShelfId,
        marketName: this.marketName,
      });
    }
  }

  // Form gönderimi
  onSubmit() {
    if (this.addShelfForm.valid) {
      const formData = {
        id: this.addShelfForm.get('shelfId')!.value,
        type: this.addShelfForm.get('shelfType')!.value,
        products: []
      };

      this.store.dispatch(addShelf({ marketId: this.selectedMarket.id, shelf: formData }));
      this.addShelfModalVisibilityChange.emit(false);
    }
  }

}
