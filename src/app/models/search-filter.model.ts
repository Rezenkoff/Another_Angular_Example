export class SearchFilterModel {
    keyword: string;
    items: FilterItemsModel[];
    constructor(keyword: string, items: FilterItemsModel[]) {
        this.keyword = keyword;
        this.items = items;
    }
}

export class FilterItemsModel {
    key: any;
    value: string;
    constructor(key: any, value: string) {
        this.key = key;
        this.value = value;
    }
}

export class FilterParameters {
    keyword: string;
    searchPrase: string;
    //cartManufacturers: number[];
    carTypes: number[];
    carModels: number[];
    productLines: string[];
    formFactor: number;
    treePartList: number[];

    constructor(searchPhrase: string, carTypes: number[], carModels: number[], productLines: string[], keyword: string, formFactor: number, treePartList: number[]) {
        this.keyword = keyword;
        this.searchPrase = searchPhrase;
        //this.cartManufacturers = cartManufacturers;
        this.carTypes = carTypes;
        this.carModels = carModels;
        this.productLines = productLines;
        this.formFactor = formFactor;
        this.treePartList = treePartList;
    }
}