import { ContractModel } from './contract.model';
import { DeliveryAddressOwner } from './delivery-address-owner.model';
import { ContractorModel } from './contractor.model';

export class ClientContractors {
    client: DeliveryAddressOwner;
    contractors: ContractorModel[];
    ownerContract: ContractModel;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}