export class SearchParamsDeliveryPoint {
    constructor(public selectedDeliveryMethodId: number = 0,
        public deliveryPointName: string = '',
        public pageSize: number = 10,
        public currentPage: number = 1,
        public isActive: string = 'all',
        public isDeliveryPoint: string = 'all',
        public cityId: number = 0,
        public selectedPaymentKey: number = 0,
        public addressDeliveryPoint: string = '') { }
}