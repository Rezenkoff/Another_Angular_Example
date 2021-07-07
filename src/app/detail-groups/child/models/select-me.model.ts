import { CarMark, CarSerie } from '../../../cars-catalog/models';
import { UtmModel } from '../../../models/utm.model';

export class SelectMe {
    userPhoneNumber: string;
    currentUrl: string;
    name: string;
    comment: string;
    vin: string;
    carMark: CarMark;
    carSerie: CarSerie;
    refId: number;
    clientId: string;
    transactionId: string;
    utmFields: UtmModel;

    constructor(userPhoneNumber: string, currentUrl: string, vin: string, name: string, comment: string, carMark: CarMark, carSerie: CarSerie, clientId?: string, utmFields?: UtmModel, attachedFiles?: Array<File>) {
        this.userPhoneNumber = userPhoneNumber;
        this.currentUrl = currentUrl;
        this.name = name;
        this.comment = comment;
        this.vin = vin;
        this.carMark = carMark;
        this.carSerie = carSerie;
        this.clientId = clientId;
        this.utmFields = utmFields;
    }
}