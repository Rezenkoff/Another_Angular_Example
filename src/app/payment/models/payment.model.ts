export class Payment {
    PaymentId: number = -1;
    PaymentName: string = "";
    Key: number = -1;

    constructor(id: number, name: string, key: number, ) {
        this.PaymentId = id;
        this.PaymentName = name;
        this.Key = key;
    }

    isValid = () => {
        return this.PaymentName != null && this.PaymentName != "";
    }
}