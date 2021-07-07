import { ClientInfo, Shipment } from "../../order-step/models";

export class UserDeliveryInfo {
    public clientInfo: ClientInfo;
    public clientInfoValid: boolean;
    public shipmentInfo: Shipment;
    public paymentTypeId: number;
    public nearestStoreAreaId: number;
    public promo: string;
    public Uid: string;
}