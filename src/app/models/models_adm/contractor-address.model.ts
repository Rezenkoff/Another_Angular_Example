import { AddressContactInfo } from "./address-contact-info.model";
import { ContractorModel } from "./contractor.model";

export class ContractorAddress {
    owner_Key: string;
    ref_Key: string;
    code: string;
    description: string;
    buildChar: string;
    streetType: string;
    id_77: string;
    latitude: number;
    longitude: number;
    buildNumber: string;
    region: string;
    note: string;
    separateSymbol: string;
    stoAddress_Ref_Key: string;
    addressType: string;
    street: string;
    workingTimeFrom: string;
    workingTimeTo: string;
    carryingCapacity: number;
    contactInfo: AddressContactInfo[];
    contractorList: ContractorModel[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}