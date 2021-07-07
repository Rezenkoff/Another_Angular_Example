export class GenericFilterSearchParamModel {
    key: string;
    value: string[];

    constructor(filterType: string, selectedKey: string) {
        this.key = filterType;
        this.value = [selectedKey];
    }
}