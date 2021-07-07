import { ContactModel } from './contact.model';

export class MarkerModel {
    address: string;
    deliveryMethodId: number;
    icon: string;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    pictureUrl: string;
    schedule: string;
    shortName: string;
    isActive: boolean;
    phones: Array<ContactModel> = new Array<ContactModel>();
    mapped1CId: string;
    postDeliveryWarehouseId: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}