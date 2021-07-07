import { InvoiceRow } from '../../models';

export class InvoiceRowRefund extends InvoiceRow {
    public quantityRefund: number;
    public compulsory: number;
    public incDecStep: number;

    constructor() {
        super();
        this.quantityRefund = 1;
        this.compulsory = 1;
        this.incDecStep = 1;
    }
}