export class CatalogAttribute {
    name: string;
    key: string;
    value: string;

    constructor(key?: string, value?: string, name?: string) {
        this.key = key;
        this.value = value;
        this.name = name;
    }
}