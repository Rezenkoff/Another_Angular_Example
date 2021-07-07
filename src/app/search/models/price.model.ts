export class Price {
    articleId: number;
    customerPrice: number;
    oldPrice?: number;
    hidePrice: boolean;
    discountPrice: number;//new
    quantityForDiscount: number;//new

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}