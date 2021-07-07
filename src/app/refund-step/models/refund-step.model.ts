import { IRefundStepModel } from './refund-step.interface';
import { InvoiceRow } from '../../models/invoice-row.model';
import { ClientInfo } from '../models/client-info.model';
import { PaymentInfo } from '../models/payment-info.model';

export class RefundStepModel implements IRefundStepModel {
    OrderId = '';
    InvoiceRows = new Array<InvoiceRow>();
    ClientInfo = new ClientInfo();
    PaymentInfo = new PaymentInfo();
}