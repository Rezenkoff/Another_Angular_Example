export class KeyValueModel {
    public key: number;
    public value: string;

    constructor(key: number, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class KeyValueStrModel {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
}