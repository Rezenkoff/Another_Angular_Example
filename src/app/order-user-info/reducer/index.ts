import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromOrderUserInfo from './order-user-info.reducer';
import * as fromRoot from '../../redux-store/reducers';

export interface OrderUserInfoState {
    cart: fromOrderUserInfo.State;
}

export interface State extends fromRoot.State {
    'order-user-info': OrderUserInfoState;
}

export const reducers = {
    cart: fromOrderUserInfo.reducer
};

export const getOrderUserInfoMainState = createFeatureSelector<OrderUserInfoState>('order-user-info');
export const getOrderUserInfoState = createSelector(getOrderUserInfoMainState, (state: OrderUserInfoState) => state.cart);
export const getCurrentUser = createSelector(getOrderUserInfoState, fromOrderUserInfo.getCurrentUser);
export const getShipmentModel = createSelector(getOrderUserInfoState, fromOrderUserInfo.getShipmentModel);
export const getUserDeliveryInfo = createSelector(getOrderUserInfoState, fromOrderUserInfo.getUserDeliveryInfo);