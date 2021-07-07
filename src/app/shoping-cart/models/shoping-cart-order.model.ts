import { Shipment, ClientInfo, ShipmentType } from '../../order-step/models';
import { MarkerModel } from '../../google-maps/models/marker';

export class SCorder {
    public shipment: Shipment;
    public paymentKey: number;
    public clientInfo: ClientInfo;
    public amount: number;
    public nearestStoreAreaId: number;
    public promo: string;
    //public deliveryPoint: MarkerModel = new MarkerModel();

    constructor() {
        this.shipment = new Shipment();
        this.shipment.ShypmentType = new ShipmentType(1, "", 1, 0);
        this.paymentKey = 21;
        this.clientInfo = new ClientInfo("","", "", "");
        this.amount = 0;
        this.promo = null;
    }
}
