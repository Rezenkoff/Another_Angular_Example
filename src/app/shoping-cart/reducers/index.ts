import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromShopingCart from './shoping-cart.reducer';
import * as fromRoot from '../../redux-store/reducers';

export interface ShopingCartState {
    cart: fromShopingCart.State;
}

export interface State extends fromRoot.State {
    'shoping-cart': ShopingCartState;
}

export const reducers = {
    cart: fromShopingCart.reducer
};

export const getShopingCartMainState = createFeatureSelector<ShopingCartState>('shoping-cart');

export const getShopingCartState = createSelector(getShopingCartMainState, (state: ShopingCartState) => state.cart);
export const getSelectedProduct = createSelector(getShopingCartState, fromShopingCart.getSelectedProduct);
export const getShopingCartLoaded = createSelector(getShopingCartState, fromShopingCart.getLoaded);
export const getCollectionLoading = createSelector(getShopingCartState, fromShopingCart.getLoading);
export const getCart = createSelector(getShopingCartState, fromShopingCart.getCart);
export const getTotalItems = createSelector(getShopingCartState, fromShopingCart.getTotalItems);
export const getTotalCartSum = createSelector(getShopingCartState, fromShopingCart.getTotalCartSum);
export const getCurrentUser = createSelector(getShopingCartState, fromShopingCart.getCurrentUser);
export const getUserPreferences = createSelector(getShopingCartState, fromShopingCart.getUserPreferences);
export const getIsAuthorized = createSelector(getShopingCartState, fromShopingCart.getIsAuthorized);
export const getTotalCartSumWithDiscount = createSelector(getShopingCartState, fromShopingCart.getTotalCartSumWithDiscount);
export const getDiscountAmount = createSelector(getShopingCartState, fromShopingCart.getDiscountAmount);
export const getDiscount = createSelector(getShopingCartState, fromShopingCart.getDiscount);
