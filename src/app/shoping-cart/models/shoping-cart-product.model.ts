export class CartProduct {
    public id: number;
    public quantity: number;
    public articleId: number;
    public price: number;
    public transletiratedTitle: string;
    public incDecStep: number;
    public compulsory: string;
    public brand: string;
    public lookupNumber: string;
    public displayDescription: string;
    public displayDescriptionUkr: string;
    public displayDescriptionRus: string;
    public cardId: string;
    public category?: string;
    public productLine: string;
    public image: string;
    public ref_Key: string;
    public weight: number;
    public isExpected: number;
    public supplierProductRef_Key: string;
    public quantityForDiscount: number;
    public discountPrice: number;
    public standardPrice: number;
    public isNeedToInstall: boolean;
    public isTire: boolean;
    public supplierRef_Key: string;

    constructor(id?: number, articleId?: number, lookupNumber?: string, transletiratedTitle?: string, price?: number, brand?: string, incDecStep?: number, compulsory?: string, displayDescription?: string, cardId?: string, productLine?: string,
        displayDescriptionUkr?: string, displayDescriptionRus?: string, ref_Key?: string, weight?: number, isExpected?: number, supplierProductRef_Key?: string, image?: string, quantityForDiscount?: number, discountPrice?: number, isTire?: boolean,
        supplierRef_Key?: string) {
        this.id = id;
        this.price = price;
        this.transletiratedTitle = transletiratedTitle;
        this.brand = brand;
        this.lookupNumber = lookupNumber;
        this.articleId = articleId;
        this.compulsory = compulsory;
        this.displayDescription = displayDescription;
        this.image = image;
        this.ref_Key = ref_Key;

        if (compulsory && compulsory === "2")
            this.incDecStep = 1;
        else if (compulsory && compulsory === "1")
            this.incDecStep = +incDecStep;
        else
            this.incDecStep = +incDecStep || 1;

        this.quantity = this.incDecStep;
        this.cardId = cardId;
        this.productLine = productLine;
        this.displayDescriptionRus = displayDescriptionRus;
        this.displayDescriptionUkr = displayDescriptionUkr;
        this.weight = weight;
        this.isExpected = isExpected;
        this.supplierProductRef_Key = supplierProductRef_Key;
        this.quantityForDiscount = quantityForDiscount;
        this.discountPrice = discountPrice;
        this.standardPrice = price;
        this.isTire = isTire;
        this.supplierRef_Key = supplierRef_Key;
    }

}

export class Cart {
    public products: Array<CartProduct>;
    public totalItems: number;
    public totalCartSum: number;
    public totalCartSumWithDiscount: number;

    constructor(products: Array<CartProduct>, totalItems: number, totalCartSum: number, totalCartSumWithDiscount: number) {
        this.products = products;
        this.totalItems = totalItems;
        this.totalCartSum = totalCartSum;
        this.totalCartSumWithDiscount = totalCartSumWithDiscount;
    }

}