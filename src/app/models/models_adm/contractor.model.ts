export class ContractorModel {

    parent_Key: string;
    customer_Number: string;
    ownerKey: string;
    ref_Key: string;
    description: string;


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}