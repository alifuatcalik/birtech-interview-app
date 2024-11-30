// src/app/states/market.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './market.reducer';

export const selectMarkets = createFeatureSelector<AppState>('markets');

export const selectAllMarkets = createSelector(
    selectMarkets,
    (state: AppState) => state.markets
);