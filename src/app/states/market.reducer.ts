// src/app/states/market.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { addShelf, addProduct, moveProduct, deleteShelf, removeProduct } from './market.actions';
import { Market } from '../models';

export interface AppState {
  markets: Market[];
}

// Initial State
export const initialState: AppState = {
  markets: [
    {
      id: 'M1',
      name: 'Market A',
      shelves: [
        {
          id: 'R1',
          type: 'Gıda',
          products: [
            {
              id: 'P1',
              name: 'Pirinç',
              category: 'Gıda'
            }
          ]
        },
        {
          id: 'R2',
          type: 'Temizlik',
          products: [
            {
              id: 'P2',
              name: 'Bez',
              category: 'Temizlik'
            }
          ]
        },
        {
          id: 'R3',
          type: 'Kırtasiye',
          products: [
            {
              id: 'P3',
              name: 'Kalem',
              category: 'Kırtasiye'
            }
          ]
        },
        {
          id: 'R4',
          type: 'Gıda',
          products: [
            {
              id: 'P4',
              name: 'Pirinç',
              category: 'Gıda'
            }
          ]
        }
      ]
    },
    {
      id: 'M2',
      name: 'Market B',
      shelves: [
        {
          id: 'R1',
          type: 'Gıda',
          products: [
            {
              id: 'P1',
              name: 'Ekmek',
              category: 'Gıda'
            }
          ]
        },
        {
          id: 'R2',
          type: 'Temizlik',
          products: [
            {
              id: 'P2',
              name: 'Sabun',
              category: 'Temizlik'
            }
          ]
        },
        {
          id: 'R3',
          type: 'Kırtasiye',
          products: [
            {
              id: 'P3',
              name: 'Silgi',
              category: 'Kırtasiye'
            }
          ]
        }
      ]
    }
  ]
};


// Reducer
export const marketReducer = createReducer(
  initialState,
  on(addShelf, (state, { marketId, shelf }) => {
    return {
      ...state,
      markets: state.markets.map((market) => {
        if (market.id === marketId) {
          return {
            ...market,
            shelves: [...market.shelves, shelf],
          };
        }
        return market;
      }),
    };
  }),
  on(addProduct, (state, { marketId, shelfId, product }) => ({
    ...state,
    markets: state.markets.map(market =>
      market.id === marketId
        ? {
          ...market,
          shelves: market.shelves.map(shelf =>
            shelf.id === shelfId
              ? {
                ...shelf,
                products: [...shelf.products, product] // Yeni ürünü ekliyoruz
              }
              : shelf
          )
        }
        : market
    )
  })),
  on(moveProduct, (state, action) => {
    // Kaynak marketi bul
    const sourceMarket = state.markets.find(market => market.id === action.sourceMarketId);
    // Hedef marketi bul
    const targetMarket = state.markets.find(market => market.id === action.targetMarketId);

    if (!sourceMarket || !targetMarket) {
      // Market bulunamazsa, state'i değiştirmeden döndür
      return state;
    }

    // Kaynak reyonu bul
    const sourceShelf = sourceMarket.shelves.find(shelf => shelf.id === action.sourceShelfId);
    // Hedef reyonu bul
    const targetShelf = targetMarket.shelves.find(shelf => shelf.id === action.targetShelfId);

    if (!sourceShelf || !targetShelf) {
      // Reyon bulunamazsa, state'i değiştirmeden döndür
      return state;
    }

    // Ürün kaynağından kaldır ve hedefe ekle
    const productToMove = sourceShelf.products.find(product => product.id === action.productId);
    if (!productToMove) {
      return state;
    }

    // Yeni source ve target reyonlarını oluştur
    const updatedSourceShelf = {
      ...sourceShelf,
      products: sourceShelf.products.filter(product => product.id !== action.productId),
    };

    const updatedTargetShelf = {
      ...targetShelf,
      products: [...targetShelf.products, { ...productToMove, name: action.productName }],
    };

    // Yeni source ve target marketlerini oluştur
    const updatedSourceMarket = {
      ...sourceMarket,
      shelves: sourceMarket.shelves.map(shelf =>
        shelf.id === action.sourceShelfId ? updatedSourceShelf : shelf
      ),
    };

    const updatedTargetMarket = {
      ...targetMarket,
      shelves: targetMarket.shelves.map(shelf =>
        shelf.id === action.targetShelfId ? updatedTargetShelf : shelf
      ),
    };

    // Yeni state'i oluştur
    return {
      ...state,
      markets: state.markets.map(market => {
        if (market.id === action.sourceMarketId) {
          return updatedSourceMarket;
        }
        if (market.id === action.targetMarketId) {
          return updatedTargetMarket;
        }
        return market;
      }),
    };
  }),
  on(deleteShelf, (state, { marketId, shelfId }) => {
    return {
      ...state,
      markets: state.markets.map((market) => {
        if (market.id === marketId) {
          return {
            ...market,
            shelves: market.shelves.filter((shelf) => shelf.id !== shelfId),
          };
        }
        return market;
      }),
    };
  }),
  on(removeProduct, (state, { marketId, shelfId, productId }) => {
    // İlgili market ve shelf'i bul
    const updatedMarkets = state.markets.map((market) => {
      if (market.id === marketId) {
        const updatedShelves = market.shelves.map((shelf) => {
          if (shelf.id === shelfId) {
            // Ürünleri filtrele, silinecek ürünü kaldır
            const updatedProducts = shelf.products.filter(
              (product) => product.id !== productId
            );
            return { ...shelf, products: updatedProducts };
          }
          return shelf;
        });
        return { ...market, shelves: updatedShelves };
      }
      return market;
    });

    return {
      ...state,
      markets: updatedMarkets
    };
  })
);