import { ShipmentType } from './shipment-type.model';
import * as defaultPrefs from '../../config/default-user-preferences';
import { SettlementModel } from '../../location/settlement/settlement.model';
import { DeliveryPointDto } from './delivery-point-dto.model';

export class Shipment {
    DestinationCity: SettlementModel = null;
    ShypmentType: ShipmentType = null;
    DeliveryPoint: DeliveryPointDto = null;
    PostDeliveryWarehouseId: string = "";

    constructor() {        
        var settlement = new SettlementModel();
        settlement.areaId = defaultPrefs.defaultAreaId;
        settlement.latitude = defaultPrefs.defaultLattitude;
        settlement.longitude = defaultPrefs.defaultLongtitude;
        settlement.nameRus = defaultPrefs.defaultCityName;
        settlement.nameUkr = defaultPrefs.defaultCityName;
        settlement.name = defaultPrefs.defaultCityName;
        
        this.ShypmentType = defaultPrefs.defaultShipmentType;
    }
}