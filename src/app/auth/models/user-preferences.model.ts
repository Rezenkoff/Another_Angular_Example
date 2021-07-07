import * as defaultPrefs from '../../config/default-user-preferences';

export class UserPreferencesModel {
    public paymentMethodId: number = defaultPrefs.defaultPaymentMethodId;
    public deliveryMethodKey: number = defaultPrefs.defaultDeliveryMethodKey;
    public deliveryMethodId: number;
    public deliveryPointKey: string; //
    public userAddress: string = ''; // for courier delivery
    public settlementKey: string = null;
    public areaId: number = defaultPrefs.defaultAreaId;
    public areaNameRus: string = '';
    public areaNameUkr: string = '';
}
