export class ContractModel {
    ref_Key: string;
    description: string;
    creditDepth: string;
    isСashOnDeliveryToThird: string;
    prepay: string;
    percentOfSale: string;
    number: string;
    kindMutualSettlement: string;
    implementationScheme: string;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}