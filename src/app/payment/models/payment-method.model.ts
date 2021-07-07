export class PaymentMethod {
    public id: number;
    public name: string;
    public key: number;

    constructor(id, name, key) {
        this.id = id;
        this.name = name;
        this.key = key;
    }

    isValid = () => {
        return this.name != null && this.name != "";
    }
}
