export class InvoiceRow {
    public ref_Key: string;
    public artId: number;
    public articleNumber: string;
    public artName: string;
    public artNameUkr: string;
    public artNameRus: string;
    public cardId: string;
    public brand: string;
    public quantity: number;
    public price: number;
    public summa: number;
    public invoice_Ref_Key: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}