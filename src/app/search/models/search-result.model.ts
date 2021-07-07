import { Product } from '../../models';

export class SearchResult {
    totalCount: number;
    products: Product[];

    constructor() {
        this.totalCount = -1;
        this.products = [];
    }
}