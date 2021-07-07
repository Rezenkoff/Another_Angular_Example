import { InvoiceRowRefund } from '../../refund-step/models/invoice-row-refund.model';

export class RefundStepDataModel {
    orderRows: InvoiceRowRefund[];

    constructor() {
        this.orderRows = [];
    }
}