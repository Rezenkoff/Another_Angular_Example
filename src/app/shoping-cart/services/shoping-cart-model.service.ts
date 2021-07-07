import { Injectable } from '@angular/core';
import { SCorder } from '../models/shoping-cart-order.model';
import { UserDeliveryInfo } from '../../order-user-info/models/user-delivery-info.model';

@Injectable()
export class ShopingCartModelService {
    private orderModel: SCorder = new SCorder();
    public isOrderValid: boolean = false;

    public get Order() {
        return this.orderModel;
    }

    public setUserDeliveryInfo(data: UserDeliveryInfo): void {
        this.orderModel.clientInfo = data.clientInfo;
        this.orderModel.paymentKey = data.paymentTypeId;
        this.orderModel.shipment = data.shipmentInfo;
        this.orderModel.nearestStoreAreaId = data.nearestStoreAreaId;
        this.orderModel.promo = data.promo;
        this.isOrderValid = this.setOrderValid();
    }

    public resetModel(): void {
        this.orderModel = new SCorder();
    }

    private setOrderValid(): boolean {
        let result: boolean = false;
        if (!this.orderModel || !this.orderModel.clientInfo) {
            return false;
        }
        if (this.orderModel.clientInfo.FirstLastName
            && this.orderModel.clientInfo.Phone
            && this.orderModel.clientInfo.Phone.length === 10) {
            result = true;
        }
        if (!result) {
            return result;
        }
        return Boolean(this.orderModel.shipment &&
            //this.orderModel.shipment.DestinationCity &&
            this.orderModel.shipment.DeliveryPoint != null && this.orderModel.shipment.DeliveryPoint.addressRus != null); 
    }
}
