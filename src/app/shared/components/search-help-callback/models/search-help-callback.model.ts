import { UtmModel } from "../../../../models/utm.model";

export class SearchHelpCallback {
    userPhoneNumber: string;
    currentUrl: string;
    refId: number;
    clientId: string;
    transactionId: string;
    utmFields: UtmModel;

    constructor(userPhoneNumber: string, currentUrl: string, clientId?: string, utmFields?: UtmModel) {
        this.userPhoneNumber = userPhoneNumber;
        this.currentUrl = currentUrl;
        this.clientId = clientId;
        this.utmFields = utmFields;
    }
}