import { InvoiceRow } from '../../models';
import { ClientInfo, PaymentInfo } from '../models';

export interface IRefundStepModel {
    OrderId: string;
    InvoiceRows: InvoiceRow[];
    ClientInfo: ClientInfo;
    PaymentInfo: PaymentInfo;
}