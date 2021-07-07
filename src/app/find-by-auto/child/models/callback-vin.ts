import { UtmModel } from "../../../models/utm.model";

export class CallbackVin {
    userPhoneNumber: string;
    currentUrl: string;
    vin: string;
    refId: number;
    vinFound: boolean;
    clientId: string;
    utmFields: UtmModel;
}