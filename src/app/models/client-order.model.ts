export class Order {
    constructor(
        public id?: string,
        public deliveryMethod?: string,
        public deliveryPoint?: string,
        public garageName?: string,
        public orderStatus?: string,
        public paymentMethod?: string,
        public deliveryAddress?: string,
        public orderDateString?: string,
        public comment: string = '',
        public part?: string,
        public hasAttachment?: boolean,
        public orderSum?: number,
        public quantity?: number,
        public wishList?: string,
        public statusDescription?: string,
        public vin?: string,
        public mark?: string,
        public model?: string,
        public markId?: number,
        public modelId?: number,
        public statusId?: number,
        public paymentMethodKey?: number,
        public vehicleYear?: string,
        public brand?: string,
        public deliveredDate?: string,
        public trackingNumber?: string,
        public arriveDate?: string,
        public longitudeDP: number = 0,
        public latitudeDP: number = 0,
        public inspectorPhoneDP: string = "",
        public deliveryMethodId: number = 0,
        public imageUrlDP: string = "",
        public discountAmount: number = 0,
        public isOpen: boolean = false
    ) { }

    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}