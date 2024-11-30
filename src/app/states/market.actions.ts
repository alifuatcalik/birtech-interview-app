// src/app/states/market.actions.ts
import { createAction, props } from '@ngrx/store';
import { Market, Product, Shelf } from '../models';

// Reyon ekleme eylemi
export const addShelf = createAction(
    '[Market] Add Shelf',
    props<{ marketId: string; shelf: Shelf }>()
);

export const deleteShelf = createAction(
    '[Market] Delete Shelf',
    props<{ marketId: string; shelfId: string }>()
);

// Ürün ekleme eylemi
export const addProduct = createAction(
    '[Market] Add Product',
    props<{ marketId: string; shelfId: string; product: Product }>()
);

// Ürün taşıma eylemi
export const moveProduct = createAction(
    '[Product] Move Product',
    props<{
        productId: string;  // Taşınacak ürünün ID'si
        productName: string;  // Taşınacak ürünün adı
        sourceMarketId: string;  // Eski market ID'si (örneğin A)
        sourceShelfId: string;  // Eski reyon ID'si (örneğin R1)
        targetMarketId: string;  // Yeni market ID'si (örneğin B)
        targetShelfId: string;  // Yeni reyon ID'si (örneğin R6)
    }>()
);

// Ürün Silme Action'ı
export const removeProduct = createAction(
    '[Market] Remove Product', // Action adı
    props<{
        marketId: string;       // Market ID'si
        shelfId: string;        // Shelf ID'si
        productId: string;      // Silinecek ürünün ID'si
    }>()
);