export class AddressContactInfo {
    ref_Key: string;
    lineNumber: string;
    phone77_Key: string;
    type: string;
    type_Key: string;
    view: string;
    phoneNumber: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}