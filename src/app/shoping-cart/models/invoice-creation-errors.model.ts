export class InvoiceCreationErrors {
    public Number: number;
    public Code: string;
    public Level: number;

    constructor(
        number: number,
        code: string,
        level: number,
    ) {
        this.Number = number;
        this.Code = code;
        this.Level = level;
    }
}
