import { InvoiceRow } from '../../models/invoice-row.model';

export class OrderCreationModel {
    constructor(public link: string,
        public id: string,
        public invoice_Ref_Key: string[],
        public data: string,
        public signature: string,
        public paymentType: number,
        public amount: number,
        public reservedRows: InvoiceRow[],
        public missingRows: any []) { }
}