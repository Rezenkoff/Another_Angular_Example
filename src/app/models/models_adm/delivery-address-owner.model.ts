export class DeliveryAddressOwner {
    address: string;
    addressName: string;
    client: string;
    clientName: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}