import { ShipmentType } from "../order-step/models/shipment-type.model";
import { Settlement } from "../location/location.model";

export const defaultPaymentMethodId: number = 21; //cash 
export const novaPoshtaDeliveryKey: number = 3;//
export const stoDeliveryKey: number = 1;//sto autodoc
export const tireFittingDeliveryKey: number = 8;
export const deliveryAutoShipmetnKey: number = 4; // "Delivery" post office
export const deliveryUkrposhtaKey: number = 5; // "Ukrposhta" post office
export const deliveryMeestExpressKey: number = 6; //MeestExpress post office
export const deliveryJustInKey: number = 7;     //JustIn post office
//default values according to ADC-499
export const courierDeliveryKey: number = 2;
export const defaultDeliveryMethodKey: number = novaPoshtaDeliveryKey;
export const defaultDeliveryMethodId: number = 6;
export const defaultShipmentType = new ShipmentType(defaultDeliveryMethodId, "Новая почта", defaultDeliveryMethodKey, 35);
export const defaultCityName: string = "Харьков";
export const defaultCityId: number = 35446;
export const defaultLattitude: number = 49.992167;
export const defaultLongtitude: number = 36.231202;
export const defaultServiceAddress = "Харків, Польова, 67";
export const defaultDeliveryPointId = 17587;
export const defaultMapped1CId = "b5303223-7015-11e6-80c9-005056a83d22";
export const defaultAreaId = 57;
export const defaultNearestStoreAreaName = "Харьков";
export const defaultArеaName = "Харьковская"
export const defaultRefNP = "e71f8842-4b33-11e4-ab6d-005056801329";

export const defaultLocation: Settlement = {
    id: defaultCityId,
    name: defaultCityName,
    latitude: defaultLattitude,
    longitude: defaultLongtitude,
    area: "",
    areaId: defaultAreaId,
    settlement: "",
    nearestStoreAreaId: defaultAreaId,
    nearestStoreAreaKey: defaultNearestStoreAreaName,
    postDeliveryCityId: "",
    ref: defaultRefNP
};