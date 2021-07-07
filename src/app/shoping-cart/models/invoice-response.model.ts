export class InvoiceRow {
    artID: number = 0;
    price: number = 0;
    brand: string = '';
    quantity: number = 1;
}

export class InvoiceData {
    data: Object = null;
    id: string = null;
    link: string = null;
    signature: string = null;
    reservedRows: Array<InvoiceRow> = new Array<InvoiceRow>();
}

export class InvoiceResponseModel {
    errors: string[] = null;
    success: boolean = false;
    data: InvoiceData = null;
}