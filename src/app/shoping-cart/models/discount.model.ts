import { DiscountType } from "./discount-type.enum";

export class DiscountModel{

    constructor() { }

    public promo: string;
    public size: number;
    public typeDiscount: DiscountType;
}