import { StrKeyValueModel } from '../../models/key-value-str.model';

export class UserCar  {
    model?: string;
    modelId?: number;
    mark?: string;
    markId?: number;
    year?: string;
    stateNumber?: string;
    vin?: string;
    milage?: number;
    isActive?: boolean;
    id?: number;
    urlImg?: string;
    ownNameCar?: string = "";
    birthdayCar?: Date;
    markKVP: StrKeyValueModel;
    serieKVP: StrKeyValueModel;
    modelKVP: StrKeyValueModel;
    yearKVP: StrKeyValueModel;
    modifKVP: StrKeyValueModel;
    carInfoPP: VehicleInfoPP;
}

export class VehicleInfoPP {
    valves?: number;
    cylinders?: number;
    engine_Cap?: number;
    power_Hp?: number;
    power_Kw?: number;
    id?: number;
    modelId?: string;
    infoDesc?: string;
    refueling?: string;
    engine_Type?: string;
    fuel?: string;
    bodyType?: string;
    years?: string;
    name?: string;
}