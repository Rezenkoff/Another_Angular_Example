export class SearchParameters {
    searchPhrase: string;
    rest: number;
    formFactor: number;
    carTypes: number[];
    carModels: number[];
    productLines: string[];
    sortOrder: number;
    sortField: string;
    treeParts: number[]
    from?: number;
    count?: number;    
    categoryUrl: string;
    selectedCategory: string;
    keyword: string; //parameter for filter options server filtering
    artId: number;
    showAll: boolean

    constructor() {
        this.searchPhrase  = '';
        this.rest = 0;
        this.formFactor = 2;
        this.carTypes = [];
        this.carModels = [];
        this.productLines = [];
        this.sortOrder = 1;
        this.sortField = '';
        this.treeParts = [];
        this.from = 0;
        this.count = 20;
        this.categoryUrl = '';  
        this.selectedCategory = '';
        this.keyword = '';
        this.artId = 0;
        this.showAll= true
    }
}