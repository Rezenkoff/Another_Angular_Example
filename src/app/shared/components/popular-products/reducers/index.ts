import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromRoot from '../../../../redux-store/reducers';
import * as fromPopularProducts from '../reducers/popular-products.reducer';

export interface State extends fromRoot.State {
    popularProducts: fromPopularProducts.PopularProductsState;
}

export const getPopularProductsMainState = createFeatureSelector<fromPopularProducts.PopularProductsState>('popular-product');

export const getPopularProducts = createSelector(getPopularProductsMainState, fromPopularProducts.getProducts);
export const getLoadShowProducts = createSelector(getPopularProductsMainState, fromPopularProducts.getProducts);