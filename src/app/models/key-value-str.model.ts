export class StrKeyValueModel {
    public key: string = "";
    public value: string = "";

    constructor(key: string, value: string) {
        this.key = key || "";
        this.value = value || "";
    }
}
export class StrKeyValueSizeModel {
    public key: string = "";
    public value: string = "";
    public size: string = "";

    constructor(key: string, value: string) {
        this.key = key || "";
        this.value = value || "";
    }
}
export class GroupModel
{
    public groupKey: number;
    public values: Array<StrKeyValueSizeModel>;
}