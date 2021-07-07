export class Discount {
    articleId: number;
    discountRate: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}