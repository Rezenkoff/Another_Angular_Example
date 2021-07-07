export class Rests2 {
    customerPrice: number;
    parent: number;
    price: number;  
    supplierId: string;   
    supplierProductRef_Key: string;
    supplierRef_Key: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}