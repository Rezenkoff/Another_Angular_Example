import { Rests2 } from "./rests2.model";

export class AutodocBalanceDetails {
    articleId: number;
    supliersRest: Rests2[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}