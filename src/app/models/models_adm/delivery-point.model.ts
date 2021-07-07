import { DeliveryMethod } from "./delivery-method.model";
import { ContactModel } from "./contact.model";
import { Settlement } from "../../location";
import { PaymentMethod } from "../../payment/models";
import { ContractorAddress } from "./contractor-address.model";
import { ContractModel } from "./contract.model";

export class DeliveryPoint {
    public id: number;
    public name: string;
    public address: string;
    public ownerAddress: ContractorAddress;
    public contract: ContractModel;
    public latitude: number;
    public longitude: number;
    public deliveryMethod: DeliveryMethod;
    public city: Settlement;
    public maxWeight: number;
    public ref: string;
    public schedule: string;
    public pictureUrl: string;
    public isActive: boolean;
    public isDeliveryPoint: boolean;
    public phones: Array<ContactModel> = new Array<ContactModel>();
    public deliveryPointBindings: BindingModel = new BindingModel();
    public paymentMethods: Array<PaymentMethod> = new Array<PaymentMethod>();
    public chiefPhone: string = "";
    public inspectorPhone: string = "";
    public isSROEnough: boolean; 

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
export class BindingModel {
    public address_Ref_Key: string;
    public linked_Addres_Ref_Key: string;
    public linked_Client_Ref_Key: string;
    public linked_Client_Name: string;
    public linked_Contract_Ref_Key: string;
    public linked_Contract_Name: string;
    public linked_Contractor_Ref_Key: string;
    public linked_Contractor_Name: string; 
}