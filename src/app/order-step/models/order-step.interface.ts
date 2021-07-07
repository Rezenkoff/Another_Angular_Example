import { ClientInfo } from './client-info.model';
import { Shipment } from './shipment.model';
import { PaymentMethod } from '../../payment/models/payment-method.model';
import { UserCar } from '../../vehicle/models/user-car.model';
import { UtmModel } from '../../models/utm.model';

export interface IOrderStepModel {
    Vehicle: UserCar;
    AttachedFiles: Array<File>;
    PaymentType: PaymentMethod;
    Shipment: Shipment;
    ContactInfo: ClientInfo;
    Wishlist: string;
    RefId: number;
    ClientId: string; 
    UtmFields: UtmModel;
    TransactionId: string;
}