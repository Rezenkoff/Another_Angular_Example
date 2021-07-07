import { Price } from "./price.model";
import { AutodocBalanceDetails } from "./autodoc-balance-details.model";

export class BalanceDetail {
    public prices: Price[];
    public supplierBalanceDetails: AutodocBalanceDetails[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}