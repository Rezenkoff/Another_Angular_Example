export class QuantityUpdateModel {
    constructor(
        public Id: number,
        public InvoiceId: number,
        public ProductId: string,
        public NewQnt: number,
        public ArtId: number
    ) { }
}