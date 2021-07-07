export class Specification {
    key: string;
    value: string;
    sort: number;
    constructor(key: string, value: string, sort:number = 0) {
        this.key = key;
        this.value = value;
        this.sort = sort;
    }
}