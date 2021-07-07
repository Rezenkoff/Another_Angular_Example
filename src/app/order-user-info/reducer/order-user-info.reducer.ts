import * as orderUserInfo from '../actions/order-user-info.actions';

import { KeyValuePair } from '../../search/models/response-images-products';
import { CurrentUser } from '../../auth/models/current-user.model';
import { UserPreferencesModel } from '../../auth/models/user-preferences.model';
import { ClientInfo } from '../../order-step/models/client-info.model';
import { Shipment } from '../../order-step/models';
import { UserDeliveryInfo } from '../models/user-delivery-info.model';
import * as defaultPrefs from '../../config/default-user-preferences';
import { MainUserInfoModel } from '../models/main-user-info.model';
import { DeliveryPointDto } from '../../order-step/models/delivery-point-dto.model';

export interface State {
    selectedLanguageName: string;
    userDeliveryInfo: UserDeliveryInfo;
}

const initialState: State = {
    selectedLanguageName: '',
    userDeliveryInfo: {
        clientInfo: new ClientInfo("","", "", ""),
        clientInfoValid: false,
        shipmentInfo: new Shipment(),
        paymentTypeId: defaultPrefs.defaultPaymentMethodId,
        nearestStoreAreaId: defaultPrefs.defaultAreaId,
        promo: null,
        Uid: ''
    },
};

export function reducer(state = initialState, action: orderUserInfo.Actions): State {
    switch (action.type) {

        case orderUserInfo.SET_USER_INFO: {

            let newClientInfo = { ...state.userDeliveryInfo.clientInfo };
            newClientInfo.Phone = action.payload.phone;
            newClientInfo.Email = action.payload.email;
            newClientInfo.FirstLastName = action.payload.name;

            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    clientInfo: newClientInfo,
                    clientInfoValid: action.payload.isValid
                }
            }
        }

        case orderUserInfo.SET_PAYMENT_METHOD: {
            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    paymentTypeId: action.payload
                }
            }
        }

        case orderUserInfo.SET_DELIVERY_METHOD: {
            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    shipmentInfo: {
                        ...state.userDeliveryInfo.shipmentInfo,
                        ShypmentType: action.payload
                    }
                }
            }
        }

        case orderUserInfo.SET_DELIVERY_POINT: {
            let point: DeliveryPointDto = (action.payload) ? {
                pointKey: action.payload.refKey,
                addressRus: action.payload.addressRus,
                addressUkr: action.payload.addressUkr,
                pointNameRus: action.payload.shortNameRus,
                pointNameUkr: action.payload.shortNameUkr
            } : null;

            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    shipmentInfo: {
                        ...state.userDeliveryInfo.shipmentInfo,
                        DeliveryPoint: point,
                    }
                }
            }
        }

        case orderUserInfo.SET_USER_ADDRESS: {
            const deliveryPoint = {
                ...new DeliveryPointDto(),
                addressRus: action.payload,
                addressUkr: action.payload
            };

            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    shipmentInfo: {
                        ...state.userDeliveryInfo.shipmentInfo,
                        DeliveryPoint: deliveryPoint
                    }
                }
            }
        }

        case orderUserInfo.SET_USER_CITY: {
            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    shipmentInfo: {
                        ...state.userDeliveryInfo.shipmentInfo,
                        DestinationCity: action.payload
                    }
                }
            }
      }

      case orderUserInfo.SET_TIRE_DATE: {
        return {
          ...state,
          userDeliveryInfo: {
            ...state.userDeliveryInfo,
            clientInfo: {
              ...state.userDeliveryInfo.clientInfo,
              TireFittingDate: action.payload
            }
          }
        }
      }

        case orderUserInfo.SET_COMMENT: {
            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    clientInfo: {
                        ...state.userDeliveryInfo.clientInfo,
                        Comment: action.payload
                    }
                }
            }
        }

        case orderUserInfo.SET_AREA_INFO: {
            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    nearestStoreAreaId: action.payload.nearestStoreAreaId
                }
            }
        }

        case orderUserInfo.SET_PROMO: {
            return {
                ...state,
                userDeliveryInfo: {
                    ...state.userDeliveryInfo,
                    promo: action.promo
                }
            }
        }

        default: {
            return state;
        }
    }
}

export const getCurrentUser = (state: State) => state.userDeliveryInfo.clientInfo;
export const getShipmentModel = (state: State) => state.userDeliveryInfo.shipmentInfo;
export const getUserDeliveryInfo = (state: State) => state.userDeliveryInfo;
