import { CheckoutItem } from './checkout-item.model';
import { ClientInfo, Shipment } from '../../order-step/models';
import { UtmModel } from '../../models';

export class CheckoutModel {
    public ClientInfo: ClientInfo;
    public Shipment: Shipment;
    public PaymentKey: number;
    public ProductList: Array<CheckoutItem>;
    public Amount: number;
    public IsReserve: boolean;
    public AreaId: number;
    public RefId: number = null;
    public CityRefRecipient: string;
    public DealId: number = null;
    public ClientId: string; 
    public UtmFields: UtmModel;
    public Promo: string;
    public UserUid: string;
    public transactionId: string;
    public TireFittingDate: string;

    constructor(client: ClientInfo, shipment: Shipment, payment: number, amount: number,
        isReserved: boolean, areaId: number, cityRefRecipient: string = '',
        products?: Array<CheckoutItem>, clientId?: string, utmFields?: UtmModel, promo?: string) {
        this.ClientInfo = client;
        this.Shipment = shipment;
        this.PaymentKey = payment;
        this.ProductList = products || [];
        this.Amount = amount;
        this.IsReserve = isReserved;
        this.AreaId = areaId;
        this.CityRefRecipient = cityRefRecipient;
        this.ClientId = clientId;
        this.UtmFields = utmFields;
        this.Promo = promo;
        this.TireFittingDate = '';
    }
}
