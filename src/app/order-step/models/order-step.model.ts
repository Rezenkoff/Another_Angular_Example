import { Shipment } from './shipment.model';
import { IOrderStepModel } from './order-step.interface';
import { ClientInfo } from './client-info.model';
import { PaymentMethod } from '../../payment/models/payment-method.model';
import { UserCar } from '../../vehicle/models/user-car.model';
import { UtmModel } from '../../models/utm.model';

export class OrderStepMainModel implements IOrderStepModel {
    Vehicle = new UserCar();
    AttachedFiles = [];
    PaymentType = new PaymentMethod(21, "Наличные", '');//default value ADC-499
    Shipment = new Shipment();
    ContactInfo = new ClientInfo();
    Wishlist = '';
    RefId: number = null;
    ClientId: string; 
    UtmFields: UtmModel = null;
    TransactionId: string = "";
};